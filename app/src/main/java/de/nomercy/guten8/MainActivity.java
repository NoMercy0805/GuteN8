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
import java.io.InputStream;
import android.webkit.WebResourceRequest;
import org.json.JSONObject;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class MainActivity extends Activity {
 WebView web;
 @Override public void onCreate(Bundle b) { super.onCreate(b);
  // Reserve a solid, undecorated area for Android system status/navigation bars.
  getWindow().setStatusBarColor(android.graphics.Color.rgb(13,29,66));
  // The bottom tabs are ivory in the original design; match the Android
  // gesture/navigation background so it no longer ends in a dark strip.
  getWindow().setNavigationBarColor(android.graphics.Color.rgb(255,250,241));
  if (Build.VERSION.SDK_INT >= 29) getWindow().setNavigationBarContrastEnforced(false);
  getWindow().getDecorView().setSystemUiVisibility(
   Build.VERSION.SDK_INT >= 26 ? android.view.View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR : 0);
  if (Build.VERSION.SDK_INT >= 30) {
   // On Android 15+ handle the system-bar insets ourselves: the WebView scene
   // must never occupy the region behind the status icons or gesture area.
   getWindow().setDecorFitsSystemWindows(Build.VERSION.SDK_INT < 35);
   getWindow().getInsetsController().setSystemBarsAppearance(
    android.view.WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS,
    android.view.WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS |
    android.view.WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS);
  }
  web=new WebView(this);
  web.setBackgroundColor(android.graphics.Color.rgb(13,29,66));
  android.widget.FrameLayout root = new android.widget.FrameLayout(this);
  root.setBackgroundColor(android.graphics.Color.rgb(13,29,66));
  root.addView(web, new android.widget.FrameLayout.LayoutParams(-1,-1));
  // Android 15+ makes the gesture navigation area transparent. Paint the
  // actual gesture inset ivory rather than leaving a dark WebView strip.
  android.view.View gestureBackdrop = new android.view.View(this);
  gestureBackdrop.setBackgroundColor(android.graphics.Color.rgb(255,250,241));
  root.addView(gestureBackdrop, new android.widget.FrameLayout.LayoutParams(-1,0,android.view.Gravity.BOTTOM));
  if (Build.VERSION.SDK_INT >= 35) {
   web.setOnApplyWindowInsetsListener((view, insets) -> {
    android.graphics.Insets system = insets.getInsets(
      android.view.WindowInsets.Type.statusBars() |
      android.view.WindowInsets.Type.navigationBars() |
      android.view.WindowInsets.Type.displayCutout());
    view.setPadding(0, system.top, 0, system.bottom);
    android.view.ViewGroup.LayoutParams lp = gestureBackdrop.getLayoutParams();
    if (lp.height != system.bottom) { lp.height = system.bottom; gestureBackdrop.setLayoutParams(lp); }
    return insets;
   });
  } web.getSettings().setJavaScriptEnabled(true); web.getSettings().setDomStorageEnabled(true);
  web.getSettings().setAllowFileAccess(true); web.getSettings().setAllowFileAccessFromFileURLs(false); web.getSettings().setAllowUniversalAccessFromFileURLs(false); web.setWebChromeClient(new WebChromeClient());
  web.setWebViewClient(new WebViewClient(){ @Override public boolean shouldOverrideUrlLoading(WebView v,String url){ return handleUrl(url); } @Override public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest request){return handleUrl(request.getUrl().toString());} });
  web.addJavascriptInterface(new Bridge(),"Android");setContentView(root);web.loadUrl("file:///android_asset/index.html");
 }
 private boolean handleUrl(String url){ if(url.startsWith("file:///android_asset/"))return false; if(url.startsWith("https://")){startActivity(new Intent(Intent.ACTION_VIEW,Uri.parse(url)));}return true; }
 public class Bridge {
  @JavascriptInterface public String version(){return BuildConfig.VERSION_NAME;}
  @JavascriptInterface public String stories(){try(InputStream in=getAssets().open("stories.json")){byte[] data=new byte[in.available()];int off=0;while(off<data.length){int n=in.read(data,off,data.length-off);if(n<0)break;off+=n;}return new String(data,0,off,java.nio.charset.StandardCharsets.UTF_8);}catch(Exception e){return "[]";}}
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
 @Override public void onBackPressed(){web.evaluateJavascript("window.guten8Back ? window.guten8Back() : false",result->{if("false".equals(result)){runOnUiThread(()->{if(web.canGoBack())web.goBack();else MainActivity.super.onBackPressed();});}});}
 @Override protected void onPause(){super.onPause();if(web!=null)web.evaluateJavascript("if(typeof stopSpeech==='function')stopSpeech()",null);}
 @Override protected void onDestroy(){if(web!=null){web.removeJavascriptInterface("Android");web.destroy();web=null;}super.onDestroy();}
}