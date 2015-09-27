package dataviz.util;

/**
 * Created by admin on 9/25/15.
 */
public class APIException extends Exception {

    private int errorCode = ErrorCodes.UNKNOWN_ERROR;

    public APIException() {
        this(ErrorCodes.UNKNOWN_ERROR);
    }

    public APIException(int errorCode) {
        this.errorCode = errorCode;
    }

    public APIException(String message) {
        this(ErrorCodes.UNKNOWN_ERROR, message);
    }

    public APIException(int errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public final int getErrorCode() {
        return errorCode;
    }
}
