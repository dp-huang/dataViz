package dataviz.service.aggregator;

import dataviz.dto.MetricsItem;
import dataviz.model.Metrics;

import java.util.List;

/**
 * Created by admin on 10/2/15.
 */
public interface AggregatorStrategy {

    List<MetricsItem> aggregate(List<Metrics> metrics, Long start, Long end, Long interval);

}
