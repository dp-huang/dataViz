package dataviz.dto;

import java.util.List;
import java.util.Map;

/**
 *
 * Get metrics response
 *
 * Created by admin on 9/25/15.
 */
public class GetMetricsResponse extends BaseResponse {

    private Map<String, List<MetricsItem>> items;

    public Map<String, List<MetricsItem>> getItems() {
        return items;
    }

    public void setItems(Map<String, List<MetricsItem>> items) {
        this.items = items;
    }
}
