package dataviz.util;

/**
 * Created by admin on 9/25/15.
 */
public class ErrorCodes {

    /** unknown error **/
    public static final int UNKNOWN_ERROR = -1;

    /** no error **/
    public static final int NO_ERROR = 0;

    /** metric string is empty **/
    public static final int METRIC_EMPTY = 1;

    /** dimension string is empty **/
    public static final int DIMENSION_EMPTY = 2;

    /** date range is not validate **/
    public static final int DATE_RANGE_INVALIDATE = 3;

    /** metric value is not validate **/
    public static final int METRIC_VALUE_INVALIDATE = 4;

    /** metric point number in response is larger than maximum allowd **/
    public static final int METRIC_TOO_MANY_POINTS = 5;
}
