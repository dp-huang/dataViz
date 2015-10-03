package dataviz.service.aggregator;

import dataviz.dto.MetricsItem;
import dataviz.model.Metrics;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by admin on 10/2/15.
 */
public class AverageAggregatorStrategy implements AggregatorStrategy {

    @Override
    public List<MetricsItem> aggregate(List<Metrics> metrics, Long start, Long end, Long interval) {
        int startIndex = 0;
        List<MetricsItem> metricsItems = new ArrayList<>();
        boolean stop = false;
        int pointNum = 0;
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
                pointNum++;
                if (m.getTimestamp() < start + interval) {
                    totalValue += m.getValue();
                    if (i == metrics.size() - 1) {
                        MetricsItem metricsItem = new MetricsItem.Builder()
                                .start(start)
                                .end(start + interval)
                                .value(totalValue / pointNum)
                                .build();
                        metricsItems.add(metricsItem);
                        stop = true;
                        start += interval;
                        break;
                    }
                } else {
                    //get the average value
                    Long average = totalValue / pointNum;
                    //store metrics between previous interval
                    MetricsItem metricsItem = new MetricsItem.Builder()
                            .start(start)
                            .end(start + interval)
                            .value(average)
                            .build();
                    metricsItems.add(metricsItem);

                    startIndex = i;
                    start += interval;
                    pointNum = 0;
                    break;
                }
            }
        }
        return metricsItems;
    }
}
