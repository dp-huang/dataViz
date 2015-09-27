package dataviz.dao;

import dataviz.model.Metrics;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 *
 * Data repository layer for data access
 *
 * Created by admin on 9/25/15.
 */
public interface MetricsDao extends CrudRepository<Metrics, String>  {

    /**
     * Get metrics from database by metric, start and end
     * @param metric
     * @param start
     * @param end
     * @return
     */
    @Query("select m from Metrics m where m.metric = :metric and m.timestamp >= :start and m.timestamp < :end order by m.id")
    public List<Metrics> getMetrics(@Param("metric") String metric, @Param("start")Long start, @Param("end")Long end);
}
