package dataviz.dto;

/**
 *
 * Get metrics request
 *
 * Created by admin on 9/26/15.
 */
public class GetMetricsRequest {

    private String metric;

    private Long start;

    private Long end;

    private Long interval;

    public String getMetric() {
        return metric;
    }

    public void setMetric(String metric) {
        this.metric = metric;
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

    public Long getInterval() {
        return interval;
    }

    public void setInterval(Long interval) {
        this.interval = interval;
    }

    public static class Builder {
        private String metric;
        private Long start;
        private Long end;
        private Long interval;

        public Builder metric(String metric) {
            this.metric = metric;
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

        public Builder interval(Long interval) {
            this.interval = interval;
            return this;
        }

        public GetMetricsRequest build() {
            GetMetricsRequest request = new GetMetricsRequest();
            request.setMetric(metric);
            request.setStart(start);
            request.setEnd(end);
            request.setInterval(interval);
            return request;
        }
    }
}
