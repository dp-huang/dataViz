package dataviz.service;

import dataviz.dao.MetricsDao;
import dataviz.dto.CreateMetricsRequest;
import dataviz.dto.CreateMetricsResponse;
import dataviz.dto.GetMetricsRequest;
import dataviz.dto.GetMetricsResponse;
import dataviz.model.Metrics;
import dataviz.util.ErrorCodes;
import org.junit.Assert;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by admin on 9/26/15.
 */

public class MetricsServiceTest {

    @Mock
    private MetricsDao metricsDao;

    @InjectMocks
    private MetricsService metricsService = new MetricsServiceImpl();

    @BeforeMethod
    public void initMocks(){
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testGetMetrics() {
        List<Metrics> metrics = new ArrayList<>();
        metrics.add(new Metrics.Builder()
                .metric("metrics")
                .dimension("dimension")
                .value(100L)
                .build());
        Mockito.when(metricsDao.getMetrics("metrics", 100L, 101L)).thenReturn(metrics);

        GetMetricsRequest request = new GetMetricsRequest.Builder()
                .metric("metrics")
                .start(100L)
                .end(101L)
                .interval(1L)
                .build();

        GetMetricsResponse response = metricsService.getMetrics(request);
        Assert.assertEquals(response.getErrCode(), ErrorCodes.NO_ERROR);
        Assert.assertEquals(response.getItems().size(), 1);
    }

    @Test
    public void testMaxAggregator() {
        List<Metrics> metrics = new ArrayList<>();
        metrics.add(new Metrics.Builder()
                .metric("metrics")
                .dimension("dimension")
                .value(100L)
                .build());

        metrics.add(new Metrics.Builder()
                .metric("metrics")
                .dimension("dimension")
                .value(200L)
                .build());
        Mockito.when(metricsDao.getMetrics(Mockito.anyString(), Mockito.anyLong(), Mockito.anyLong())).thenReturn(metrics);

        Long now = Math.round(System.currentTimeMillis() * 0.001);
        GetMetricsRequest request = new GetMetricsRequest.Builder()
                .metric("metrics")
                .start(now - 5L)
                .end(now)
                .interval(10L)
                .agg("max")
                .build();

        GetMetricsResponse response = metricsService.getMetrics(request);
        Assert.assertEquals(response.getErrCode(), ErrorCodes.NO_ERROR);
        Assert.assertEquals(response.getItems().size(), 1);
        Assert.assertEquals(response.getItems().get("dimension").get(0).getValue().longValue(), 200l);
    }

    @Test
    public void testAverageAggregator() {
        List<Metrics> metrics = new ArrayList<>();
        metrics.add(new Metrics.Builder()
                .metric("metrics")
                .dimension("dimension")
                .value(100L)
                .build());

        metrics.add(new Metrics.Builder()
                .metric("metrics")
                .dimension("dimension")
                .value(200L)
                .build());
        Mockito.when(metricsDao.getMetrics(Mockito.anyString(), Mockito.anyLong(), Mockito.anyLong())).thenReturn(metrics);

        Long now = Math.round(System.currentTimeMillis() * 0.001);
        GetMetricsRequest request = new GetMetricsRequest.Builder()
                .metric("metrics")
                .start(now - 5L)
                .end(now)
                .interval(10L)
                .agg("average")
                .build();

        GetMetricsResponse response = metricsService.getMetrics(request);
        Assert.assertEquals(response.getErrCode(), ErrorCodes.NO_ERROR);
        Assert.assertEquals(response.getItems().size(), 1);
        Assert.assertEquals(response.getItems().get("dimension").get(0).getValue().longValue(), 150l);
    }

    @Test
    public void testGetMultipleMetrics() {
        List<Metrics> metrics = new ArrayList<>();
        Metrics m1 = new Metrics.Builder()
                .metric("metrics")
                .dimension("dimension1")
                .value(100L)
                .build();
        Metrics m2 = new Metrics.Builder()
                .metric("metrics")
                .dimension("dimension2")
                .value(100L)
                .build();
        metrics.add(m1);
        metrics.add(m2);

        Mockito.when(metricsDao.getMetrics("metrics", 100L, 101L)).thenReturn(metrics);

        GetMetricsRequest request = new GetMetricsRequest.Builder()
                .metric("metrics")
                .start(100L)
                .end(101L)
                .interval(1L)
                .build();
        GetMetricsResponse response = metricsService.getMetrics(request);
        Assert.assertEquals(response.getErrCode(), ErrorCodes.NO_ERROR);
        Assert.assertEquals(response.getItems().size(), 2);
        Assert.assertEquals(response.getItems().keySet().contains("dimension1"), true);
        Assert.assertEquals(response.getItems().keySet().contains("dimension2"), true);
    }

    @Test
    public void testException() {
        GetMetricsRequest request = new GetMetricsRequest.Builder()
                .metric("metrics")
                .start(100L)
                .end(100000000L)
                .interval(1L)
                .build();
        List<Metrics> metrics = new ArrayList<>();
        metrics.add(new Metrics.Builder()
                .metric("metrics")
                .dimension("dimension")
                .value(100L)
                .build());
        Mockito.when(metricsDao.getMetrics(Mockito.anyString(), Mockito.anyLong(), Mockito.anyLong())).thenReturn(metrics);
        GetMetricsResponse response = metricsService.getMetrics(request);
        Assert.assertEquals(response.getErrCode(), ErrorCodes.METRIC_TOO_MANY_POINTS);
    }

    @Test
    public void testCreateMetrics() {
        CreateMetricsRequest request = new CreateMetricsRequest();
        request.setMetric("metrics");
        request.setDimension("dimension");
        request.setValue(100L);

        Metrics m = new Metrics.Builder()
                .metric("metrics")
                .dimension("dimension")
                .value(100L)
                .build();

        Mockito.when(metricsDao.save(Mockito.any(Metrics.class))).thenReturn(m);

        CreateMetricsResponse response = metricsService.createMetrics(request);
        Assert.assertEquals(response.getErrCode(), ErrorCodes.NO_ERROR);
    }
}
