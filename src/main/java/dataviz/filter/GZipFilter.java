package dataviz.filter;

import dataviz.util.StringUtil;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.GZIPOutputStream;

/**
 *
 * GZIP filter for better network transfer performance
 *
 * Created by admin on 9/26/15.
 */
public class GZipFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // TODO Auto-generated method stub

    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {

        HttpServletResponse resp = (HttpServletResponse) response;
        HttpServletRequest req = (HttpServletRequest) request;
        if (isGZipEncoding(req)) {
            GZipServletResponseWrapper GZipServletResponseWrapper = new GZipServletResponseWrapper(resp);
            chain.doFilter(request, GZipServletResponseWrapper);
            byte[] gzipData = gzip(GZipServletResponseWrapper.getResponseData());
            resp.addHeader("Content-Encoding", "gzip");
            resp.setContentLength(gzipData.length);
            ServletOutputStream output = response.getOutputStream();
            output.write(gzipData);
            output.flush();
        } else {
            chain.doFilter(request, response);
        }

    }

    @Override
    public void destroy() {

    }

    /**
     * whether browser supports GZIP
     *
     * @param request
     * @return
     */
    private static boolean isGZipEncoding(HttpServletRequest request) {
        boolean flag = false;
        String encoding = request.getHeader("Accept-Encoding");
        if (!StringUtil.isEmpty(encoding) && encoding.indexOf("gzip") != -1) {
            flag = true;
        }
        return flag;
    }

    private byte[] gzip(byte[] data) {
        ByteArrayOutputStream byteOutput = new ByteArrayOutputStream(10240);
        GZIPOutputStream output = null;
        try {
            output = new GZIPOutputStream(byteOutput);
            output.write(data);
        } catch (IOException e) {
        } finally {
            try {
                output.close();
            } catch (IOException e) {
            }
        }
        return byteOutput.toByteArray();
    }
}

