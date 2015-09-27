package dataviz.dto;

/**
 *
 * Metrics item that's included in GetMetricsResponse
 *
 * Created by admin on 9/25/15.
 */
public class MetricsItem {

    private Long value;

    private Long start;

    private Long end;

    public Long getValue() {
        return value;
    }

    public void setValue(Long value) {
        this.value = value;
    }

    public Long getStart() {
        return start;
    }

    public void setStart(Long start) {
        this.start = start;
    }

    public Long getEnd() {
        return end;
    }

    public void setEnd(Long end) {
        this.end = end;
    }

    public static class Builder {
        private Long value;
        private Long start;
        private Long end;

        public Builder value(Long value) {
            this.value = value;
            return this;
        }

        public Builder start(Long start) {
            this.start = start;
            return this;
        }

        public Builder end(Long end) {
            this.end = end;
            return this;
        }

        public MetricsItem build() {
            MetricsItem item = new MetricsItem();
            item.setValue(value);
            item.setStart(start);
            item.setEnd(end);
            return item;
        }
    }
}
