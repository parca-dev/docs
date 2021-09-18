# Concepts

## Data model

## Pprof

## Icicle Graphs

Often to better understand how your application is behaving you need to compare two profiles. Parca allows you to make selections of two points in time that you want to compare and will generate an icicle graph of the difference between the two selected profiles.

If a span is larger in the second profile, you'll see that span colored in red, and will be darker shade the larger the difference is. This allows one to quickluy visually identify where a program is growing in usage scope. 
![image](https://user-images.githubusercontent.com/8681572/133893354-38719c9e-fc80-4d27-8b08-33f917d99df8.png)

You'll see in the image below with the profile selections reversed from the previous example, that the spans that are now smaller in the second selection are colored green. This allows you to quickly visually identify where improvements to usage are being made.
![image](https://user-images.githubusercontent.com/8681572/133893380-ca093b33-992c-4878-b96c-2f7c82473b65.png)

If a span remains blue, it means there was no significant change between the two compared profiles for that section of code.


