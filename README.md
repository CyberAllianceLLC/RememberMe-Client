# Remember Me  
## Setup  
First create the `ionic.config.json` file within the root directory of the application.
```bash
# install all modules
$ npm install

# Start ionic serve
$ npm run serve

# Build and run for android and ios
$ ionic cordova build <android/ios>
$ ionic cordova run <android/ios>

# Build project (optional)
$ npm run build

# Clean the build (optional)
$ npm run client
```  
## Release For Production  
More information can be found [here](https://ionicframework.com/docs/v1/guide/publishing.html).
```bash
# remove console logging
$ ionic cordova plugin rm cordova-plugin-console

# Build release for android and ios
$ ionic cordova build --release <android/ios>

# Create private key for signing application using keytool that comes with JDK
$ keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000

# Sign unsigned application
$ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore remembermeapp-release-unsigned.apk alias_name

# Zip align application after signing
$ zipalign -v 4 remembermeapp-release-unsigned.apk RememberMeApp.apk
```
