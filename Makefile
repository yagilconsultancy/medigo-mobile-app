.PHONY: ios-build ios-preview android-build android-preview

ios-build:
	eas build --platform ios --profile production
ios-submit:
	eas submit --platform ios

ios-preview:
	eas build --platform ios --profile preview

android-build:
	eas build --platform android --profile production

android-preview:
	eas build --platform android --profile preview
