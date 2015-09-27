package dataviz.dto;

/**
 *
 * Create metrics request
 *
 * Created by admin on 9/25/15.
 */
public class CreateMetricsRequest {

    private String metric;

    private String dimension;

    private Long value;

    public String getMetric() {
        return metric;
    }

    public void setMetric(String metric) {
        this.metric = metric;
    }

    public String getDimension() {
        return dimension;
    }

    public void setDimension(String dimension) {
        this.dimension = dimension;
    }

    public Long getValue() {
        return value;
    }

    public void setValue(Long value) {
        this.value = value;
    }
}
