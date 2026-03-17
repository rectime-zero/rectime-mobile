package com.rectime

import android.os.Build
import android.view.RoundedCorner
import android.view.WindowInsets
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class DisplayCornersModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "DisplayCornersModule"

    @ReactMethod
    fun getCorners(promise: Promise) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
            promise.resolve(createCornerMap(0.0, 0.0, 0.0, 0.0))
            return
        }

        val activity = currentActivity

        if (activity == null) {
            promise.reject("E_ACTIVITY_UNAVAILABLE", "Current activity is unavailable")
            return
        }

        val rootWindowInsets = activity.window.decorView.rootWindowInsets

        if (rootWindowInsets == null) {
            promise.reject("E_WINDOW_INSETS_UNAVAILABLE", "WindowInsets are unavailable")
            return
        }

        val density = reactContext.resources.displayMetrics.density.toDouble()
        promise.resolve(
            createCornerMap(
                getCornerRadius(rootWindowInsets, RoundedCorner.POSITION_TOP_LEFT, density),
                getCornerRadius(rootWindowInsets, RoundedCorner.POSITION_TOP_RIGHT, density),
                getCornerRadius(rootWindowInsets, RoundedCorner.POSITION_BOTTOM_LEFT, density),
                getCornerRadius(rootWindowInsets, RoundedCorner.POSITION_BOTTOM_RIGHT, density),
            ),
        )
    }

    private fun getCornerRadius(
        insets: WindowInsets,
        position: Int,
        density: Double,
    ): Double {
        val roundedCorner = insets.getRoundedCorner(position) ?: return 0.0
        return roundedCorner.radius / density
    }

    private fun createCornerMap(
        topLeft: Double,
        topRight: Double,
        bottomLeft: Double,
        bottomRight: Double,
    ) = Arguments.createMap().apply {
        putDouble("topLeft", topLeft)
        putDouble("topRight", topRight)
        putDouble("bottomLeft", bottomLeft)
        putDouble("bottomRight", bottomRight)
    }
}
