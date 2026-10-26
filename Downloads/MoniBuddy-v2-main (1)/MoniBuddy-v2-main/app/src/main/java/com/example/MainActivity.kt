package com.example

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.ViewGroup
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewClientCompat
import com.example.ui.theme.MyApplicationTheme
import java.io.InputStream

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()
    setContent {
      MyApplicationTheme {
        Surface(modifier = Modifier.fillMaxSize().safeDrawingPadding()) {
          MoniBuddyWebView()
        }
      }
    }
  }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun MoniBuddyWebView(modifier: Modifier = Modifier) {
  AndroidView(
    modifier = modifier.fillMaxSize(),
    factory = { context ->
      val assetLoader = WebViewAssetLoader.Builder()
        .setDomain("appassets.androidplatform.net")
        .addPathHandler("/assets/") { rawPath ->
          openAsset(context, "assets/$rawPath", rawPath)
        }
        .addPathHandler("/public/") { rawPath ->
          openAsset(context, rawPath, rawPath)
        }
        .addPathHandler("/") { rawPath ->
          openAsset(context, rawPath, rawPath)
        }
        .build()

      WebView(context).apply {
        layoutParams = ViewGroup.LayoutParams(
          ViewGroup.LayoutParams.MATCH_PARENT,
          ViewGroup.LayoutParams.MATCH_PARENT
        )
        settings.apply {
          javaScriptEnabled = true
          domStorageEnabled = true
          databaseEnabled = true
          allowFileAccess = true
          allowContentAccess = true
          mediaPlaybackRequiresUserGesture = false
          mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        }
        webChromeClient = object : WebChromeClient() {
          override fun onPermissionRequest(request: PermissionRequest) {
            request.grant(request.resources)
          }
        }
        webViewClient = object : WebViewClientCompat() {
          override fun shouldInterceptRequest(
            view: WebView,
            request: WebResourceRequest
          ): WebResourceResponse? {
            // Check asset loader first
            val intercepted = assetLoader.shouldInterceptRequest(request.url)
            if (intercepted != null) return intercepted

            // Fallback: direct asset lookup for any unhandled path
            val path = request.url.path?.trimStart('/') ?: ""
            return openAsset(context, path, path)
          }
        }
        loadUrl("https://appassets.androidplatform.net/index.html")
      }
    }
  )
}

private fun openAsset(
  context: android.content.Context,
  primaryPath: String,
  rawPath: String
): WebResourceResponse? {
  val clean = primaryPath.trimStart('/')
  val cleanRaw = rawPath.trimStart('/')
  val candidates = listOf(
    clean,
    cleanRaw,
    if (clean.isEmpty() || clean == "index.html") "index.html" else "",
    if (clean.isEmpty() || clean == "index.html") "web/index.html" else "",
    "assets/$clean",
    "assets/$cleanRaw",
    "web/$clean",
    "web/$cleanRaw",
    "web/assets/$clean",
    "web/assets/$cleanRaw"
  ).filter { it.isNotEmpty() }

  var stream: InputStream? = null
  var resolved = ""
  for (candidate in candidates) {
    try {
      stream = context.assets.open(candidate)
      resolved = candidate
      break
    } catch (_: Exception) {
    }
  }

  return if (stream != null) {
    val mime = when {
      resolved.endsWith(".html") -> "text/html"
      resolved.endsWith(".js") || resolved.endsWith(".mjs") -> "application/javascript"
      resolved.endsWith(".css") -> "text/css"
      resolved.endsWith(".svg") -> "image/svg+xml"
      resolved.endsWith(".png") -> "image/png"
      resolved.endsWith(".wasm") -> "application/wasm"
      resolved.endsWith(".woff2") -> "font/woff2"
      resolved.endsWith(".json") || resolved.endsWith(".webmanifest") -> "application/json"
      else -> "application/octet-stream"
    }
    WebResourceResponse(mime, "UTF-8", stream)
  } else {
    null
  }
}
