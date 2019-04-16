package com.yihengquan.wowsinfo;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.thebylito.navigationbarcolor.NavigationBarColorPackage;
import com.sbugert.rnadmob.RNAdMobPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.dooboolab.RNIap.RNIapPackage;
import com.horcrux.svg.SvgPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new KCKeepAwakePackage(),
            new NavigationBarColorPackage(),
            new RNAdMobPackage(),
            new AsyncStoragePackage(),
            new RNIapPackage(),
            new SvgPackage(),
            new VectorIconsPackage(),
            new ReactNativeLocalizationPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();

    SoLoader.init(this, /* native exopackage */ false);
  }
}
