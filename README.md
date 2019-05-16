# basinwatch


<video loop autoplay width=500 align="center" style="margin: 0 auto; width: 500px; display: block; padding-bottom: 30px">
  <source src="https://files.t11a.me/file/t11a-xyz/Screen-Recording-2019-05-16-14-19-09-1558041551.mp4">
</video>

This project aims to create a dashboard for viewing current streamflow anomalies at a basin-scale across the Colorado river basin.

I was inspired to do this after a large snowfall year in Colorado (2018-19), in preparation to see the massive increases in melt rate and streamflow as the melt season progresses.

## Components

**Web Application**: The core of this product is a front-end web application with the following features:
  * Allow for quick basin-scale viewing of real-time streamflow anomalies
  * Allow for viewing of specific hydrographs

**API**: The data needs of this application, and the relatively complex calculations required for some of those, mean that we need a set of API endpoints which both remove computation from the browser and allow for access of periodically-computed values. 
