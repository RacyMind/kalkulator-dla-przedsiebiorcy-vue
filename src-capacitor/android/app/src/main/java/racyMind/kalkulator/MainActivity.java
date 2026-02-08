package racyMind.kalkulator;

import com.getcapacitor.BridgeActivity;
 import android.os.Bundle;
 import android.graphics.Color;
 import androidx.core.view.WindowCompat;
 import androidx.core.view.WindowInsetsControllerCompat;

 public class MainActivity extends BridgeActivity {
 
   @Override
   protected void onCreate(Bundle savedInstanceState) {
     WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
     super.onCreate(savedInstanceState);

     getWindow().setStatusBarColor(Color.parseColor("#1565C0"));
     new WindowInsetsControllerCompat(getWindow(), getWindow().getDecorView())
       .setAppearanceLightStatusBars(false);
   }
 }
