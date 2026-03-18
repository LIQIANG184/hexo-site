```
[VERBOSE-2:dart_vm_initializer.cc(41)] Unhandled Exception: Invalid argument(s): Failed to lookup symbol 'ffi_RsFileDownloadCallback_Constructor': dlsym(RTLD_DEFAULT, ffi_RsFileDownloadCallback_Constructor): symbol not found
#0      DynamicLibrary.lookup (dart:ffi-patch/ffi_dynamic_library_patch.dart:33:70)
#1      ptr_ffi_RsFileDownloadCallback_Constructor (package:rs_device_controller/RsFileDownloadState_ffiapi.dart:133:88)
#2      ptr_ffi_RsFileDownloadCallback_Constructor (package:rs_device_controller/RsFileDownloadState_ffiapi.dart)
#3      ffi_RsFileDownloadCallback_Constructor (package:rs_device_controller/RsFileDownloadState_ffiapi.dart:134:53)
#4      ffi_RsFileDownloadCallback_Constructor (package:rs_device_controller/RsFileDownloadState_ffiapi.dart)
#5      new RsFileDownloadCallback.Constructor (package:rs_device_controller/RsFileDownloadState.dart:406:22)
#6      _RSPoincareDeviceManager.getProductRawData (package:rs_poincare_main_page/rs_poincare_device_vm.dart:541:62)
#7      RSPoincareDeviceViewModel.getProductRawData (package:rs_poincare_main_page/rs_poincare_device_vm.dart:300:51)
#8      RSPoincareCaptureViewModel.checkAndPrepareUploadData (package:rs_poincare_main_page/rs_poincare_main_page_vm.dart:766:26)
<asynchronous suspension>
```
#解决办法
AppDelegate里调用一下这个函数
```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    ffi_RsFileDownloadCallback_Constructor();
    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}
```
