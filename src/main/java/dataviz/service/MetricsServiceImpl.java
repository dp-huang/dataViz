package dataviz.service;

import dataviz.dao.MetricsDao;
import dataviz.dto.*;
import dataviz.model.Metrics;
import dataviz.util.APIException;
import dataviz.util.Constants;
import dataviz.util.ErrorCodes;
import dataviz.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Created by admin on 9/25/15.
 */
@Service
@ComponentScan
@Transactional
public class MetricsServiceImpl implements MetricsService {

    @Autowired
    private MetricsDao metricsDao;

    @Override
    public GetMetricsResponse getMetrics(GetMetricsRequest request) {
        GetMetricsResponse response = new GetMetricsResponse();
        try {
            if (StringUtil.isEmpty(request.getMetric())) {
                throw new APIException(ErrorCodes.METRIC_EMPTY);
            }
            if (request.getStart() >= request.getEnd()
                    || request.getStart() <= 0
                    || request.getEnd() <= 0
                    || request.getInterval() <= 0) {
                throw new APIException(ErrorCodes.DATE_RANGE_INVALIDATE);
            }
            //if end is larger than current, use current timestamp
            Long now = Math.round(System.currentTimeMillis() * 0.001);
            if (request.getEnd() > now) {
                request.setEnd(now);
            }
            if (Math.round((request.getEnd() - request.getStart()) / request.getInterval()) > Constants.MAX_POINTS) {
                throw new APIException(ErrorCodes.METRIC_TOO_MANY_POINTS);
            }
            List<Metrics> metrics = metricsDao.getMetrics(request.getMetric(), request.getStart(), request.getEnd());
            if (metrics.isEmpty()) {
                return response;
            }
            Map<String, List<MetricsItem>> metricsItems = splitMetrics(metrics, request.getStart(), request.getEnd(), request.getInterval());
            response.setItems(metricsItems);
        } catch (APIException e) {
            response.setErrCode(e.getErrorCode());
        }
        return response;
    }

    @Override
    public CreateMetricsResponse createMetrics(CreateMetricsRequest request) {
        CreateMetricsResponse response = new CreateMetricsResponse();
        try {
            if (StringUtil.isEmpty(request.getMetric())) {
                throw new APIException(ErrorCodes.METRIC_EMPTY);
            }
            if (StringUtil.isEmpty(request.getDimension())) {
                throw new APIException(ErrorCodes.DIMENSION_EMPTY);
            }
            if (request.getValue() < 0) {
                throw new APIException(ErrorCodes.METRIC_VALUE_INVALIDATE);
            }
            Metrics metrics = new Metrics.Builder()
                    .metric(request.getMetric())
                    .dimension(request.getDimension())
                    .value(request.getValue())
                    .build();
            Metrics saved = metricsDao.save(metrics);
            response.setId(saved.getId());
        } catch (APIException e) {
            response.setErrCode(e.getErrorCode());
        }
        return response;
    }

    /**
     * split the whole metrics to different dimensions with a hash map
     * @param metrics
     * @param start
     * @param end
     * @param interval
     * @return
     */
    private Map<String, List<MetricsItem>> splitMetrics(List<Metrics> metrics, Long start, Long end, Long interval) {
        Map<String, List<Metrics>> map = metrics.stream().collect(Collectors.groupingBy(a -> a.getDimension()));
        Map<String, List<MetricsItem>> metricsResult = new HashMap<>();
        map.keySet().stream().forEach((k) -> {
            List<MetricsItem> dimensionMetrics = aggregateMetricsDimension(map.get(k), start, end, interval);
            metricsResult.put(k, dimensionMetrics);
        });
        return metricsResult;
    }

    /**
     * aggregate one dimension metrics
     * @param metrics
     * @param start
     * @param end
     * @param interval
     * @return
     */
    private List<MetricsItem> aggregateMetricsDimension(List<Metrics> metrics, Long start, Long end, Long interval) {
        int startIndex = 0;
        List<MetricsItem> metricsItems = new ArrayList<>();
        boolean stop = false;
        while(start < end) {
            Long totalValue = 0L;
            if (stop) {
                MetricsItem metricsItem = new MetricsItem.Builder()
                        .start(start)
                        .end(start + interval)
                        .value(0L)
                        .build();
                metricsItems.add(metricsItem);
                start += interval;
                continue;
            }
            for(int i = startIndex; i < metrics.size(); i++) {
                Metrics m = metrics.get(i);

                if (m.getTimestamp() < start + interval) {
                    totalValue += m.getValue();
                    if (i == metrics.size() - 1) {
                        MetricsItem metricsItem = new MetricsItem.Builder()
                                .start(start)
                                .end(start + interval)
                                .value(totalValue)
                                .build();
                        metricsItems.add(metricsItem);
                        stop = true;
                        start += interval;
                        break;
                    }
                } else {
                    //store metrics between previous interval
                    MetricsItem metricsItem = new MetricsItem.Builder()
                            .start(start)
                            .end(start + interval)
                            .value(totalValue)
                            .build();
                    metricsItems.add(metricsItem);

                    startIndex = i;
                    start += interval;
                    break;
                }
            }
        }
        return metricsItems;
    }
}
