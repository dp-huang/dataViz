package dataviz.model;

import javax.persistence.*;
import java.io.Serializable;

/**
 *
 * The data entity for metrics
 *
 * Created by admin on 9/25/15.
 */
@Entity
@Table(name = "metrics", indexes = @Index(columnList = "metric, timestamp"))
public class Metrics implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String metric;

    @Column(nullable = false)
    private String dimension;

    @Column(nullable = false)
    private Long value;

    @Column(nullable = false)
    private Long timestamp;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public static class Builder {
        private String metric;
        private String dimension;
        private Long value;

        public Builder metric(String metric) {
            this.metric = metric;
            return this;
        }

        public Builder dimension(String dimension) {
            this.dimension = dimension;
            return this;
        }

        public Builder value(Long value) {
            this.value = value;
            return this;
        }

        public Metrics build() {
            Metrics metrics = new Metrics();
            metrics.setMetric(metric);
            metrics.setDimension(dimension);
            metrics.setValue(value);
            //convert to second
            Long timestamp = Math.round(System.currentTimeMillis() * 0.001);
            metrics.setTimestamp(timestamp);
            return metrics;
        }
    }
}
