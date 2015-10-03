package dataviz.service.aggregator;

import dataviz.util.Constants;

/**
 * Created by admin on 10/2/15.
 */
public class AggregatorFactory {

    private static boolean isAverage(String strategy) {
        return Constants.AGGREGATOR_AVE.equalsIgnoreCase(strategy);
    }

    private static boolean isMax(String strategy) {
        return Constants.AGGREGATOR_MAX.equalsIgnoreCase(strategy);
    }

    private static boolean isSum(String strategy) {
        return Constants.AGGREGATOR_SUM.equalsIgnoreCase(strategy);
    }

    public static AggregatorStrategy createAggregator(String strategy) {
        if (isAverage(strategy)) {
            return new AverageAggregatorStrategy();
        }
        if (isSum(strategy)) {
            return new SumAggregatorStrategy();
        }
        //default
        return new MaxAggregatorStrategy();
    }

}
