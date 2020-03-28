export function handlerMapInit({
    BMap,
    map
}) {
    var point = new BMap.Point(this.center.lng, this.center.lat);
    map.centerAndZoom(point, 13)
    var marker = this.marker = new BMap.Marker(point) // 创建标注
    map.addOverlay(marker) // 将标注添加到地图中
    var circle = new BMap.Circle(point, 6, {
        strokeColor: 'Red',
        strokeWeight: 6,
        strokeOpacity: 1,
        Color: 'Red',
        fillColor: '#f03'
    })
    map.addOverlay(circle)
}
export function getMapClickInfo(e) {
    // console.log(e.point.lng)
    // console.log(e.point.lat)
    // this.center.lng = e.point.lng
    // this.center.lat = e.point.lat

    this.marker && this.map.removeOverlay(this.marker);
    // console.info(this.map.getBounds())

    var point = new BMap.Point(e.point.lng, e.point.lat);
    var marker = this.marker = new BMap.Marker(point);
    this.map.remove
    this.map.addOverlay(marker);

    this.queryEntites();
}