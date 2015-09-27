package dataviz.service;

import dataviz.dto.CreateMetricsRequest;
import dataviz.dto.CreateMetricsResponse;
import dataviz.dto.GetMetricsRequest;
import dataviz.dto.GetMetricsResponse;

/**
 *
 * Service Layer
 *
 * Created by admin on 9/25/15.
 */
public interface MetricsService {

    /**
     * Get metrics data
     * @param request
     * @return
     */
    GetMetricsResponse getMetrics(GetMetricsRequest request);

    /**
     * Create metrics
     * @param request
     * @return
     */
    CreateMetricsResponse createMetrics(CreateMetricsRequest request);
}
