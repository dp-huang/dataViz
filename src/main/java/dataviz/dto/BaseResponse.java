package dataviz.dto;

import dataviz.util.ErrorCodes;

/**
 * Base response entity
 *
 * Created by admin on 9/25/15.
 */
public class BaseResponse {
    private int errCode;
    private String errMsg;

    public BaseResponse() {
        this.errCode = ErrorCodes.NO_ERROR;
    }

    public int getErrCode() {
        return errCode;
    }

    public void setErrCode(int errCode) {
        this.errCode = errCode;
    }

    public String getErrMsg() {
        return errMsg;
    }

    public void setErrMsg(String errMsg) {
        this.errMsg = errMsg;
    }
}
