export function handlerMapInit({
    BMap,
    map,
    center
}) {
    var point = new BMap.Point(center.lng, center.lat);
    map.centerAndZoom(point, this.zoom)
    
    var marker = this.marker = new BMap.Marker(point) // 创建标注
    map.addOverlay(marker) // 将标注添加到地图中
    var circle = this.circle = new BMap.Circle(point, this.radius * 1000, {
        strokeColor: 'rgba(0, 128, 0, 0.2)',
        strokeWeight: 6,
        strokeOpacity: 0.2,
        Color: 'rgba(0, 128, 0, 0.2)',
        fillColor: 'rgba(0, 128, 0, 0.2)'
    })
    map.addOverlay(circle);
}

export function getMapClickInfo(e) {
    // console.log(e.point.lng)
    // console.log(e.point.lat)
    // this.center.lng = e.point.lng
    // this.center.lat = e.point.lat

    // console.info(this.map.getBounds())
    
    var point = new BMap.Point(e.point.lng, e.point.lat);
    this.center = {lng: e.point.lng, lat: e.point.lat};
    // this.map.remove(this.marker);
    this.marker && this.map.removeOverlay(this.marker);
    var marker = this.marker = new BMap.Marker(point);
    this.map.addOverlay(marker);
    this.bounds = this.map.getBounds();
}