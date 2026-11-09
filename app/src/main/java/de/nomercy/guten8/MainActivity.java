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
   // Android 15/16 enforce edge-to-edge for newer targets. Handle insets on
   // the root container, never as padding inside the scrollable WebView.
   getWindow().setDecorFitsSystemWindows(Build.VERSION.SDK_INT < 35);
   getWindow().getInsetsController().setSystemBarsAppearance(
    android.view.WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS,
    android.view.WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS |
    android.view.WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS);
  }
  web = new WebView(this);
  web.setBackgroundColor(android.graphics.Color.rgb(13,29,66));
  android.widget.FrameLayout root = new android.widget.FrameLayout(this);
  // The system-gesture region stays ivory; the status region stays midnight.
  root.setBackgroundColor(android.graphics.Color.rgb(255,250,241));
  android.widget.FrameLayout.LayoutParams webParams =
    new android.widget.FrameLayout.LayoutParams(-1,-1);
  root.addView(web, webParams);
  android.view.View statusBackdrop = new android.view.View(this);
  statusBackdrop.setBackgroundColor(android.graphics.Color.rgb(13,29,66));
  root.addView(statusBackdrop,
    new android.widget.FrameLayout.LayoutParams(-1,0,android.view.Gravity.TOP));
  if (Build.VERSION.SDK_INT >= 35) {
   root.setOnApplyWindowInsetsListener((view, insets) -> {
    android.graphics.Insets bars = insets.getInsets(
     android.view.WindowInsets.Type.statusBars() |
     android.view.WindowInsets.Type.navigationBars() |
     android.view.WindowInsets.Type.displayCutout());
    android.widget.FrameLayout.LayoutParams wlp =
     (android.widget.FrameLayout.LayoutParams)web.getLayoutParams();
    if (wlp.topMargin != bars.top || wlp.bottomMargin != bars.bottom) {
     wlp.topMargin = bars.top;
     wlp.bottomMargin = bars.bottom;
     web.setLayoutParams(wlp);
    }
    android.widget.FrameLayout.LayoutParams slp =
     (android.widget.FrameLayout.LayoutParams)statusBackdrop.getLayoutParams();
    if (slp.height != bars.top) {
     slp.height = bars.top;
     statusBackdrop.setLayoutParams(slp);
    }
    return insets;
   });
  } web.getSettings().setJavaScriptEnabled(true); web.getSettings().setDomStorageEnabled(true);
  web.getSettings().setAllowFileAccess(true); web.getSettings().setAllowFileAccessFromFileURLs(false); web.getSettings().setAllowUniversalAccessFromFileURLs(false); web.setWebChromeClient(new WebChromeClient());
  web.setWebViewClient(new WebViewClient(){ @Override public boolean shouldOverrideUrlLoading(WebView v,String url){ return handleUrl(url); } @Override public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest request){return handleUrl(request.getUrl().toString());} });
  web.addJavascriptInterface(new Bridge(),"Android");setContentView(root);if(Build.VERSION.SDK_INT>=35)root.requestApplyInsets();web.loadUrl("file:///android_asset/index.html");
 }
 private boolean handleUrl(String url){ if(url.startsWith("file:///android_asset/"))return false; if(url.startsWith("https://")){startActivity(new Intent(Intent.ACTION_VIEW,Uri.parse(url)));}return true; }
 public class Bridge {
  @JavascriptInterface public String version(){return BuildConfig.VERSION_NAME;}
  @JavascriptInterface public String stories(){try(InputStream in=getAssets().open("stories.json")){byte[] data=new byte[in.available()];int off=0;while(off<data.length){int n=in.read(data,off,data.length-off);if(n<0)break;off+=n;}return new String(data,0,off,java.nio.charset.StandardCharsets.UTF_8);}catch(Exception e){return "[]";}}
   }
 private int compare(String a,String b){try{String[] x=a.split("\\."),y=b.split("\\.");for(int i=0;i<3;i++){int p=i<x.length?Integer.parseInt(x[i]):0,q=i<y.length?Integer.parseInt(y[i]):0;if(p!=q)return Integer.compare(p,q);}}catch(Exception e){}return 0;}
 @Override public void onBackPressed(){web.evaluateJavascript("window.guten8Back ? window.guten8Back() : false",result->{if("false".equals(result)){runOnUiThread(()->{if(web.canGoBack())web.goBack();else MainActivity.super.onBackPressed();});}});}
 @Override protected void onPause(){super.onPause();if(web!=null)web.evaluateJavascript("if(typeof stopSpeech==='function')stopSpeech()",null);}
 @Override protected void onDestroy(){if(web!=null){web.removeJavascriptInterface("Android");web.destroy();web=null;}super.onDestroy();}
}