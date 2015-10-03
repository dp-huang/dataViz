package dataviz.service.aggregator;

import dataviz.dto.MetricsItem;
import dataviz.model.Metrics;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by admin on 10/2/15.
 */
public class MaxAggregatorStrategy implements AggregatorStrategy {

    @Override
    public List<MetricsItem> aggregate(List<Metrics> metrics, Long start, Long end, Long interval) {
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
                    //get the max value
                    if (totalValue < m.getValue()) {
                        totalValue = m.getValue();
                    }
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
