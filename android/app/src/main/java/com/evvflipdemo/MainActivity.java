package com.evvflipdemo;

import com.facebook.react.ReactActivity;
import com.botree.barcodescanner.ZxingPackage;
import android.content.Intent;
import android.os.Bundle;
import android.os.PowerManager;
import android.net.Uri;
import android.provider.Settings;
import android.os.Build;
import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;
import android.app.ActivityManager;
import android.content.Context;
public class MainActivity extends ReactActivity {
	private ZxingPackage mZxingPackage;
	private IntentIntegrator integrator;
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "EvvFlipDemo";
    }
    @Override
	protected void onCreate(Bundle savedInstanceState) {
	    super.onCreate(savedInstanceState);
		if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Intent intent = new Intent();
            String packageName = getPackageName();
            PowerManager pm = (PowerManager) getSystemService(POWER_SERVICE);
            if (!pm.isIgnoringBatteryOptimizations(packageName)) {
                intent.setAction(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                intent.setData(Uri.parse("package:" + packageName));
                startActivity(intent);
            }
        }
	    mZxingPackage = new ZxingPackage(MainActivity.this);
	    integrator = new IntentIntegrator(MainActivity.this);
	}

	@Override
	public void onActivityResult(final int requestCode, final int resultCode, final Intent data) {
	    super.onActivityResult(requestCode, resultCode, data);
		IntentResult result = integrator.parseActivityResult(requestCode, resultCode, data);
	      if(result != null) {
	          if(result.getContents() == null) {
	              mZxingPackage.handleActivityResult(result);
	          } else {
	          	mZxingPackage.handleActivityResult(result);
	          }
	      }
	    
	}
    @Override
    public void onBackPressed(){
        finish();
        // System.gc();
        // System.exit(0);
    }
    @SuppressWarnings("deprecation")
	private boolean isServiceAlive(Class<?> serviceClass) {
        ActivityManager manager = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                return true;
            }
        }
        return false;
    }
}
