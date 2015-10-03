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

    private String agg;

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

    public String getAgg() {
        return agg;
    }

    public void setAgg(String agg) {
        this.agg = agg;
    }

    public static class Builder {
        private String metric;
        private Long start;
        private Long end;
        private Long interval;
        private String agg;

        public Builder metric(String metric) {
            this.metric = metric;
            return this;
        }

        public Builder start(Long start) {
            this.start = start;
            return this;
        }

        public Builder end(Long end) {
            //if end is larger than current, use current timestamp
            Long now = Math.round(System.currentTimeMillis() * 0.001);
            if (end > now) {
                this.end = now;
            } else {
                this.end = end;
            }
            return this;
        }

        public Builder interval(Long interval) {
            this.interval = interval;
            return this;
        }

        public Builder agg(String agg) {
            this.agg = agg;
            return this;
        }

        public GetMetricsRequest build() {
            GetMetricsRequest request = new GetMetricsRequest();
            request.setMetric(metric);
            request.setStart(start);
            request.setEnd(end);
            request.setInterval(interval);
            request.setAgg(agg);
            return request;
        }
    }
}
