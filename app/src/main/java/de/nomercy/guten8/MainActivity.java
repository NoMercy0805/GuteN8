package de.nomercy.guten8;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.JavascriptInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.widget.Toast;
import android.webkit.WebResourceRequest;
import org.json.JSONObject;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class MainActivity extends Activity {
 WebView web;
 @Override public void onCreate(Bundle b) { super.onCreate(b);
  web=new WebView(this); web.getSettings().setJavaScriptEnabled(true); web.getSettings().setDomStorageEnabled(true);
  web.getSettings().setAllowFileAccess(true); web.getSettings().setAllowFileAccessFromFileURLs(false); web.getSettings().setAllowUniversalAccessFromFileURLs(false); web.setWebChromeClient(new WebChromeClient());
  web.setWebViewClient(new WebViewClient(){ @Override public boolean shouldOverrideUrlLoading(WebView v,String url){ return handleUrl(url); } @Override public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest request){return handleUrl(request.getUrl().toString());} });
  web.addJavascriptInterface(new Bridge(),"Android");setContentView(web);web.loadUrl("file:///android_asset/index.html");
 }
 private boolean handleUrl(String url){ if(url.startsWith("file:///android_asset/"))return false; if(url.startsWith("https://")){startActivity(new Intent(Intent.ACTION_VIEW,Uri.parse(url)));}return true; }
 public class Bridge {
  @JavascriptInterface public String version(){return BuildConfig.VERSION_NAME;}
  @JavascriptInterface public void checkUpdate(){
   new Thread(()->{try{
    HttpURLConnection c=(HttpURLConnection)new URL("https://api.github.com/repos/NoMercy0805/GuteN8/releases/latest").openConnection();
    c.setConnectTimeout(10000);c.setReadTimeout(10000);c.setRequestProperty("Accept","application/vnd.github+json");
    if(c.getResponseCode()!=200)throw new Exception("Noch kein Release verfügbar");
    BufferedReader br=new BufferedReader(new InputStreamReader(c.getInputStream()));StringBuilder sb=new StringBuilder();String line;while((line=br.readLine())!=null)sb.append(line);
    JSONObject j=new JSONObject(sb.toString());String tag=j.optString("tag_name","").replaceFirst("^v","");
    String link="";org.json.JSONArray assets=j.optJSONArray("assets");
    if(assets!=null)for(int i=0;i<assets.length();i++){JSONObject a=assets.getJSONObject(i);if(a.optString("name").endsWith(".apk")){link=a.optString("browser_download_url",link);break;}}
    if(link.isEmpty())throw new Exception("Release enthält keine APK");
    String finalLink=link;boolean newer=compare(tag,BuildConfig.VERSION_NAME)>0;
    web.post(()->web.evaluateJavascript("window.onUpdateResult("+JSONObject.quote(tag)+","+newer+","+JSONObject.quote(finalLink)+")",null));
   }catch(Exception e){web.post(()->web.evaluateJavascript("window.onUpdateError("+JSONObject.quote(e.getMessage())+")",null));}}).start();
  }
  @JavascriptInterface public void openLink(String url){if(url.startsWith("https://github.com/NoMercy0805/GuteN8/releases/") || url.startsWith("https://github.com/NoMercy0805/GuteN8/releases/download/"))runOnUiThread(()->startActivity(new Intent(Intent.ACTION_VIEW,Uri.parse(url))));}
 }
 private int compare(String a,String b){try{String[] x=a.split("\\."),y=b.split("\\.");for(int i=0;i<3;i++){int p=i<x.length?Integer.parseInt(x[i]):0,q=i<y.length?Integer.parseInt(y[i]):0;if(p!=q)return Integer.compare(p,q);}}catch(Exception e){}return 0;}
 @Override public void onBackPressed(){if(web.canGoBack())web.goBack();else super.onBackPressed();}
}