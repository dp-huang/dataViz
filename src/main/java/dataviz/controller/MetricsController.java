package dataviz.controller;

import dataviz.dto.CreateMetricsRequest;
import dataviz.dto.CreateMetricsResponse;
import dataviz.dto.GetMetricsRequest;
import dataviz.dto.GetMetricsResponse;
import dataviz.service.MetricsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

/**
 * The restful service controller
 *
 * Created by admin on 9/25/15.
 */

@RestController
@RequestMapping(value = "/api/metrics")
public class MetricsController {

    @Autowired
    private MetricsService metricsService;

    /**
     * Create metrics
     * @param request
     * @return
     */
    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public CreateMetricsResponse createMetrics(
            @RequestBody CreateMetricsRequest request) {
        return metricsService.createMetrics(request);
    }

    /**
     * Get metrics by multiple parameters
     * @param metric
     * @param start
     * @param end
     * @param interval
     * @return
     */
    @RequestMapping(value = "/{metric}", method = RequestMethod.GET)
    public GetMetricsResponse getMetrics(
            @PathVariable("metric") String metric,
            @RequestParam("start") Long start,
            @RequestParam("end") Long end,
            @RequestParam("interval") Long interval) {

        GetMetricsRequest request = new GetMetricsRequest.Builder()
                .metric(metric)
                .start(start)
                .end(end)
                .interval(interval)
                .build();
        return metricsService.getMetrics(request);
    }
}
