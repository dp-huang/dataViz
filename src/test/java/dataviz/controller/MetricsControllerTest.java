package dataviz.controller;

import dataviz.dto.GetMetricsRequest;
import dataviz.dto.GetMetricsResponse;
import dataviz.dto.MetricsItem;
import dataviz.service.MetricsService;
import dataviz.util.ErrorCodes;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.testng.annotations.BeforeMethod;
import org.junit.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by admin on 9/27/15.
 */

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration
@WebAppConfiguration
public class MetricsControllerTest {

    @Mock
    private MetricsService metricsService;

    @InjectMocks
    private MetricsController metricsController = new MetricsController();

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @BeforeMethod
    public void initMocks(){
        MockitoAnnotations.initMocks(this);
    }

    @Before
    public void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }


    @Test
    public void testGetMetrics() throws Exception {
        GetMetricsResponse response = new GetMetricsResponse();
        Map<String, List<MetricsItem>> map = new HashMap<>();
        List<MetricsItem> items = new ArrayList<>();
        items.add(new MetricsItem.Builder()
            .start(100L)
            .end(101L)
            .value(100L)
            .build()
        );
        map.put("dimension", items);

        Mockito.when(metricsService.getMetrics(Mockito.any(GetMetricsRequest.class))).thenReturn(response);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/metrics?start=100&end=101&interval=1"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("errCode").value(Matchers.eq(ErrorCodes.NO_ERROR)))
                .andExpect(MockMvcResultMatchers.jsonPath("items").exists());
    }
}
