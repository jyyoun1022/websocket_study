/**
 * [수정이력]
 * 2024-08-22 조성옥 CAL_TYPE_ONLY_PCD 타입추가(요청 김도훈B) Call 정보 없이 PCD로만 작업하는 경우
 */
Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};

const _ren = {
    fn : {}
    , data : {
        calibrationMap : null
    }
    , constants : {
        CAL_TYPE_HD_01 : "TYPE_HD_01"
        , CAL_TYPE_HD_02 : "TYPE_HD_02"
        , CAL_TYPE_HD_03 : "HD_COMBINE_CAL_01"
        , CAL_TYPE_42_01 : "TYPE_42_01"
        , CAL_TYPE_42_POC : "TYPE_42_POC"
        , CAL_TYPE_42_2024_01 : "CAL_TYPE_42_2024_01"
        , CAL_TYPE_MOBIS_01 : "TYPE_MOBIS_01"
        , CAL_TYPE_MOBIS_2024_POC_01 : "TYPE_MOBIS_2024_POC_01"
        , CAL_TYPE_LG_01 : '[|{|\"camera_internal\":{|\"fx\":'
        , CAL_TYPE_KITTI : "P0: "
        , CAL_TYPE_WOOWAHAN_00 : "TYPE_WOOWAHAN_00"
        , CAL_TYPE_OTOKAR : "TYPE_OTOKAR_CAL"
        , CAL_TYPE_ONLY_PCD : "CAL_TYPE_ONLY_PCD"
        , CAL_TYPE_HD_04_TEMP : "CAL_TYPE_HD_04_TEMP"
        , CAL_TYPE_HD_04_NEW : "CAL_TYPE_HD_04_NEW"
        , CAL_TYPE_HD_POC_2024_01 : "CAL_TYPE_HD_POC_2024_01"
        , CAL_TYPE_NAVERLABS_2025_01 : "CAL_TYPE_NAVERLABS_2025_01"
        , OBJECT_TYPE_CUBOID : "cuboid"
        , OBJECT_TYPE_ROT : "cuboid_yaw"
        , linesOfCuboid : [[0, 1], [0, 5], [0, 2], [1, 3], [1, 4], [5, 7], [4, 6], [2, 7], [3, 6], [5, 4], [7, 6], [2, 3]]
        , polygonOfCuboid : [
            [0, 5, 4, 1]   //back
            , [0, 2, 3, 1] //top
            , [0, 2, 7, 5] //left
            , [1, 3, 6, 4] //bottom
            , [5, 7, 6, 4] //right
            , [2, 7, 6, 3] //front
        ], CAL_TYPE_HD_03_SUB : {
            v1 : "v1 23/02/15"
            , v1_3 : "v1.3 23/03/08"
        }
        , linesOfFrontPoints : [0, 4, 5, 1]
        , isCalError : false
    }
}

/**
 * Canvas 에 3D rendering
 * @param param.canvasElement   : DOM Element
 * @param param.calibrationTxt  : Calibration File Contents
 * @param param.objectList      : object list
 *  [
 *      {
 *          objectType      : "cuboid"/"points"
 *          , pointList     : [{"x":0, "y": 0, "z": 0}]
 *          , isLine        : true/false, view of line, default = true
 *          , lineWidth     : (int) line width, default = 5, only objectType='cuboid'
 *          , lineColor     : HEX Color Code, default = white #ffffff, only objectType='cuboid'
 *          , lineOpacity   : default = 0.5 (param.opacity)
 *          , isFill        : true/false, fill of surface, default = true
 *          , fillColor     : HEX Color Code, default = green #00ff00, only objectType='cuboid'
 *          , fillOpacity   : default = 0.5 (param.opacity)
 *          , isRotation    : true/false, view of front surface, default = true
 *          , rotationColor : HEX Color Code, default = green #00ff00, only objectType='cuboid'
 *          , rotationOpacity: default = 0.5 (param.opacity)
 *          , rotationWidth : (int) rotation line width, default = 10
 *      }
 *  ]
 * @param param.naturalWidth    : image.naturalWidth
 * @param param.naturalHeight   : image.naturalHeight
 * @param param.circleSize      : (int) circle size, default=10
 * @param param.circleColor     : HEX Color Code, default = red #ff0000
 * @param param.isDot           : true/false, draw dot, default = true
 * @param param.opacity         : opacity default value = 0.5
 * @param param.centerPosition  : center position
 */
_ren.fn.draw3dToCanvas = function(param) {
    param.circleSize = param.circleSize ? param.circleSize : 10;
    param.circleColor= param.circleColor ? param.circleColor : "#ff0000";
    param.isDot      = param.isDot == false ? false : true;
    param.opacity    = param.opacity ? param.opacity : 0.5;



    _ren.data.param = param;
    let objectList = [];
    if(param.objectList != null && param.objectList.length > 0) {
        param.objectList.forEach(function(object){
            let pointList = object.pointList;
            let xList = [];
            let yList = [];
            let zList = [];
            if(pointList != null && pointList.length > 0) {
                pointList.forEach(function(point){
                    xList.push(point.x);
                    yList.push(point.y);
                    zList.push(point.z);
                });
            }
            let xyzList = [xList, yList, zList];
            object.points = xyzList;
            let cal = _ren.fn.getConvertCalibrationValues(param.calibrationTxt);
            if(cal != null) {
                //_ren.data.cal = cal;
                objectList.push(_ren.fn.calcPixel(object, cal));
                for(let ooo of objectList) {
                    if (_common.isNotEmpty(ooo.centerPosition)) {
                        let co = JSON.parse(JSON.stringify(ooo));
                        let center = [[ooo.centerPosition.x], [ooo.centerPosition.y], [ooo.centerPosition.z]];
                        co.points = center;
                        let centerXY = _ren.fn.calcPixelSimple(co, cal);
                        ooo.centerPosition2d = centerXY;
                        param.centerPosition2d = centerXY;
                    } else {
                        log.warn("no have center 1");
                    }
                }
            } else {
                if(!_ren.constants.isCalError) {
                    _ren.constants.isCalError = true;
                    log.error(param.calibrationTxt, "_ren.fn.draw3dToCanvas, calibration contents is wrong.");
                }
            }
        });
    }
    _ren.fn.drawingToCanvas(param, objectList);
}
/**
 * make bbox from 3d object
 * @param param.calibrationTxt  : Calibration File Contents
 * @param param.object = {
 *          objectType      : "cuboid"/"points"
 *          , pointList     : [{"x":0, "y": 0, "z": 0}]
 *      }
 * @param param.naturalWidth    : image.naturalWidth
 * @param param.naturalHeight   : image.naturalHeight
 */
_ren.fn.getBboxFromObject = function(param) {
    let pointList = param.object.pointList;
    let xList = [];
    let yList = [];
    let zList = [];
    if(pointList != null && pointList.length > 0) {
        pointList.forEach(function(point){
            xList.push(point.x);
            yList.push(point.y);
            zList.push(point.z);
        });
    }
    let xyzList = [xList, yList, zList];
    param.object.points = xyzList;
    let cal = _ren.fn.getConvertCalibrationValues(param.calibrationTxt);
    let converted = _ren.fn.calcPixel(param.object, cal);
    log.info(converted, "converted, _ren.fn.getBboxFromObject");
    let bbox = {x: 0, y: 0, width: 0, height: 0, x1: 99999, y1: 99999, x2: -1, y2: -1, isVisible: true};
    if(converted.pointList.length > 0) {
        converted.pointList.forEach(function (xy) {
            bbox.x1 = Math.min(xy.x, bbox.x1);
            bbox.y1 = Math.min(xy.y, bbox.y1);

            bbox.x2 = Math.max(xy.x, bbox.x2);
            bbox.y2 = Math.max(xy.y, bbox.y2);
        });
        bbox.x1 = bbox.x1 < 0 ? 0 : bbox.x1;
        bbox.y1 = bbox.y1 < 0 ? 0 : bbox.y1;
        if(param.naturalWidth) {
            bbox.x2 = bbox.x2 > param.naturalWidth ? param.naturalWidth : bbox.x2;
        }
        if(param.naturalHeight) {
            bbox.y2 = bbox.y2 > param.naturalHeight ? param.naturalHeight : bbox.y2;
        }

        bbox.x = Math.round(bbox.x1);
        bbox.y = Math.round(bbox.y1);
        bbox.width = Math.round(bbox.x2 - bbox.x1);
        bbox.height = Math.round(bbox.y2 - bbox.y1);
    } else {
        bbox = {x: 0, y: 0, width: 0, height: 0, x1: 0, y1: 0, x2: 0, y2: 0, isVisible: false};
    }
    log.info(bbox, "_ren.fn.getBboxFromObject");
    return bbox;
}

_ren.fn.drawingToCanvas = function(param, objectList) {
    const dpr = window.devicePixelRatio;

    param.width = param.canvasElement.width;
    param.height = param.canvasElement.height;

    //param.canvasElement.style.width = param.naturalWidth+`px`;
    //param.canvasElement.style.height = param.naturalHeight+`px`;
    param.canvasElement.width =  param.naturalWidth * dpr;
    param.canvasElement.height = param.naturalHeight * dpr;
    let ctx = param.canvasElement.getContext('2d');

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, param.canvasElement.width, param.canvasElement.height);
    ctx.beginPath();
    ctx.closePath();
    ctx.globalAlpha = 1; //param.opacity != null ? param.opacity : 0.5;
    const cc = 2 * Math.PI;

    let rx = param.canvasElement.width / param.naturalWidth / dpr;
    let ry = param.canvasElement.height / param.naturalHeight / dpr;
    if(objectList != null && objectList.length > 0) {
        objectList.forEach(function(object){
            _ren.data._tempObject = JSON.parse(JSON.stringify(object));
            if(_common.isNotEmpty(object.centerPosition2d)) {
                ctx.fillStyle = param.circleColor;
                ctx.beginPath();
                let center = {
                    x : object.centerPosition2d[0].x * rx
                    , y : object.centerPosition2d[0].y * ry
                };
                //(100,100) 중심 , 반지름 20 , 3시 기준 , 90˚ 각도 , 시계방향

                ctx. arc (center.x , center.y , param.circleSize * rx , 0 , 360, false );
                // ctx.arc(center.x, center.y, param.circleSize * rx, 0, false);
                ctx.closePath();
                ctx.fill();
                log.warn("draw center");
            } else {
                log.warn("no have center 2");
            }
            if(object.objectType == _ren.constants.OBJECT_TYPE_CUBOID) {
                if(object.pointList.length == 8) {
                    object.isLine    = object.isLine == false ? false : true;
                    object.lineColor = object.lineColor ? object.lineColor : "#ffffff";
                    object.lineWidth = object.lineWidth ? object.lineWidth : 5;

                    object.isFill    = object.isFill == false ? false : true;
                    object.fillColor = object.fillColor ? object.fillColor : "#ff00f2";

                    object.isRotation    = object.isRotation == false ? false : true;
                    object.rotationColor = object.rotationColor ? object.rotationColor : "#00ff00";

                    if(object.isFill == true) {
                        _ren.constants.polygonOfCuboid.forEach(function (polygon) {
                            object.fillOpacity = $.isNumeric(object.fillOpacity) ? object.fillOpacity : param.opacity;
                            let rgba = object.fillColor.startsWith("#") ? _ren.fn.getRgbaString(object.fillColor, object.fillOpacity) : object.fillColor;
                            object.fillColorRgba = rgba;
                            ctx.fillStyle  = object.fillColorRgba;
                            ctx.beginPath();
                            ctx.moveTo(object.pointList[polygon[0]].x * rx, object.pointList[polygon[0]].y * ry);
                            ctx.lineTo(object.pointList[polygon[1]].x * rx, object.pointList[polygon[1]].y * ry);
                            ctx.lineTo(object.pointList[polygon[2]].x * rx, object.pointList[polygon[2]].y * ry);
                            ctx.lineTo(object.pointList[polygon[3]].x * rx, object.pointList[polygon[3]].y * ry);
                            ctx.fill();
                            ctx.closePath();
                        });
                    }

                    if(object.isRotation) {
                        try {
                            object.rotationWidth = $.isNumeric(object.rotationWidth) ? object.rotationWidth : 10;
                            let ptIdx = [0, 1, 4, 5];
                            let revIdx = [2, 3, 6, 7];

                            const defV = 999999;
                            let cp = {minX: defV, minY: defV, minZ: defV, maxX: -defV, maxY: -defV, maxZ: -defV};
                            let rp = {minX: defV, minY: defV, minZ: defV, maxX: -defV, maxY: -defV, maxZ: -defV};
                            for (let i = 0; i < 4; i++) {
                                cp.minX = Math.min(cp.minX, object.xyzList[0][ptIdx[i]]);
                                cp.minY = Math.min(cp.minY, object.xyzList[1][ptIdx[i]]);
                                cp.minZ = Math.min(cp.minZ, object.xyzList[2][ptIdx[i]]);
                                cp.maxX = Math.max(cp.maxX, object.xyzList[0][ptIdx[i]]);
                                cp.maxY = Math.max(cp.maxY, object.xyzList[1][ptIdx[i]]);
                                cp.maxZ = Math.max(cp.maxZ, object.xyzList[2][ptIdx[i]]);

                                rp.minX = Math.min(rp.minX, object.xyzList[0][revIdx[i]]);
                                rp.minY = Math.min(rp.minY, object.xyzList[1][revIdx[i]]);
                                rp.minZ = Math.min(rp.minZ, object.xyzList[2][revIdx[i]]);
                                rp.maxX = Math.max(rp.maxX, object.xyzList[0][revIdx[i]]);
                                rp.maxY = Math.max(rp.maxY, object.xyzList[1][revIdx[i]]);
                                rp.maxZ = Math.max(rp.maxZ, object.xyzList[2][revIdx[i]]);
                            }
                            cp.x = _ren.fn.listAvg([cp.minX, cp.maxX]);
                            cp.y = _ren.fn.listAvg([cp.minY, cp.maxY]);
                            cp.z = _ren.fn.listAvg([cp.minZ, cp.maxZ]);
                            rp.x = _ren.fn.listAvg([rp.minX, rp.maxX]);
                            rp.y = _ren.fn.listAvg([rp.minY, rp.maxY]);
                            rp.z = _ren.fn.listAvg([rp.minZ, rp.maxZ]);

                            let d = {x : cp.x - rp.x, y : cp.y - rp.y, z : cp.z - rp.z};
                            rp.x = cp.x + (d.x * 0.5);
                            rp.y = cp.y + (d.y * 0.5);
                            rp.z = cp.z + (d.z * 0.5);

                            object.cp = cp;
                            object.rp = rp;
                            let rotPtList = [[cp.x, rp.x], [cp.y, rp.y], [cp.z, rp.z]];
                            let cal = _ren.fn.getConvertCalibrationValues(param.calibrationTxt);
                            let rotResult = _ren.fn.calcPixelSimple({
                                type: _ren.constants.OBJECT_TYPE_ROT
                                , points: rotPtList
                            }, cal);

                            object.rotationOpacity = $.isNumeric(object.rotationOpacity) ? object.rotationOpacity : param.opacity;
                            let rgba = object.rotationColor.startsWith("#") ? _ren.fn.getRgbaString(object.rotationColor, object.rotationOpacity) : object.rotationColor;
                            object.rotationRgba = rgba;

                            ctx.strokeStyle  = object.rotationRgba;
                            ctx.beginPath();
                            ctx.moveTo(rotResult[0].x * rx, rotResult[0].y * ry);
                            ctx.lineTo(rotResult[1].x * rx, rotResult[1].y * ry);

                            ctx.lineWidth = object.rotationWidth * rx;
                            ctx.stroke();
                            ctx.closePath();

                            object.rotResult = rotResult;
                            _ren.data._tempObject2 = object;
                        } catch (E) {}
                    }

                    if(object.isLine == true) {
                        _ren.constants.linesOfCuboid.forEach(function (line) {
                            object.lineOpacity = $.isNumeric(object.lineOpacity) ? object.lineOpacity : param.opacity;
                            let rgba = object.lineColor.startsWith("#") ? _ren.fn.getRgbaString(object.lineColor, object.lineOpacity) : object.lineColor;
                            object.lineRgba = rgba;
                            ctx.setLineDash([]);
                            ctx.strokeStyle = object.lineRgba;
                            ctx.beginPath();
                            ctx.moveTo(object.pointList[line[0]].x * rx, object.pointList[line[0]].y * ry);
                            ctx.lineTo(object.pointList[line[1]].x * rx, object.pointList[line[1]].y * ry);
                            ctx.lineWidth = object.lineWidth * rx;
                            ctx.stroke();
                            ctx.closePath();
                        });
                    }

                }
            }
            // if(param.isDot) {
            //     for (let i = 0; i < object.pointList.length; i++) {
            //         ctx.fillStyle = param.circleColor; //red
            //         ctx.beginPath();
            //         ctx.arc(object.pointList[i].x * rx, object.pointList[i].y * ry, param.circleSize * rx, 0, cc);
            //         ctx.closePath();
            //         ctx.fill();
            //     }
            // }
        });
    }
    _ren.data.result = objectList;
}
_ren.fn.matmul = function(a,b){
    if (!Array.isArray(a) || !Array.isArray(b) || !a.length || !b.length) {
        throw new Error('arguments should be in 2-dimensional array format');
    }
    let x = a.length,
        z = a[0].length,
        y = b[0].length;
    if (b.length !== z) {
        // XxZ & ZxY => XxY
        throw new Error('number of columns in the first matrix should be the same as the number of rows in the second');
    }
    let productRow = Array.apply(null, new Array(y)).map(Number.prototype.valueOf, 0);
    let product = new Array(x);
    for (let p = 0; p < x; p++) {
        product[p] = productRow.slice();
    }
    for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {
            for (let k = 0; k < z; k++) {
                product[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    return product;
}
_ren.fn.typeHd_02ConvertQtoR = function(q0, q1, q2, q3) {
    // First row of the rotation matrix
    let r00 = 2 * (q0 * q0 + q1 * q1) - 1;
    let r01 = 2 * (q1 * q2 - q0 * q3);
    let r02 = 2 * (q1 * q3 + q0 * q2);

    // Second row of the rotation matrix
    let r10 = 2 * (q1 * q2 + q0 * q3);
    let r11 = 2 * (q0 * q0 + q2 * q2) - 1;
    let r12 = 2 * (q2 * q3 - q0 * q1);

    // Third row of the rotation matrix
    let r20 = 2 * (q1 * q3 - q0 * q2);
    let r21 = 2 * (q2 * q3 + q0 * q1);
    let r22 = 2 * (q0 * q0 + q3 * q3) - 1;

    // 3x3 rotation matrix
    let rot_matrix = [[r00, r01, r02],
        [r10, r11, r12],
        [r20, r21, r22]];

    return rot_matrix
}
_ren.fn.type_NaverLab_ConvertQtoR = function(q_w, q_x, q_y, q_z) {
    // First row of the rotation matrix
    let r00 = 1 - 2*(q_y**2 + q_z**2);
    let r01 = 2*(q_x*q_y - q_z*q_w);
    let r02 = 2*(q_x*q_z + q_y*q_w);

    // Second row of the rotation matrix
    let r10 = 2*(q_x*q_y + q_z*q_w);
    let r11 = 1 - 2*(q_x**2 + q_z**2);
    let r12 = 2*(q_y*q_z - q_x*q_w);

    // Third row of the rotation matrix
    let r20 = 2*(q_x*q_z - q_y*q_w);
    let r21 = 2*(q_y*q_z + q_x*q_w);
    let r22 = 1 - 2*(q_x**2 + q_y**2);

    // 3x3 rotation matrix
    let rot_matrix = [[r00, r01, r02],
        [r10, r11, r12],
        [r20, r21, r22]];

    return rot_matrix
}
_ren.fn.calcPixelSimple = function(object, cal) {
    let result = [];
    if(cal.type == _ren.constants.CAL_TYPE_HD_01) {
        let xyzList = object.points;
        // xyzList = [
        //     [2.52555305406305, 4.5255530540630495, 2.52555305406305, 4.5255530540630495, 2.52555305406305, 4.5255530540630495, 2.52555305406305, 4.5255530540630495]
        //     , [-15.713756543298643, -15.713756543298643, -15.713756543298643, -15.713756543298643, -21.093756543298625, -21.093756543298625, -21.093756543298625, -21.093756543298625]
        //     , [0.31499999999998396, 0.31499999999998396, -1.9499999999999997, -1.9499999999999997, 0.31499999999998396, 0.31499999999998396, -1.9499999999999997, -1.9499999999999997]
        // ]
        xyzList = JSON.parse(JSON.stringify(xyzList));

        let pointLength = xyzList[0].length;
        let l1 = [[0, 1, 0], [0, 0, -1], [-1, 0, 0]];
        let l2 = [[1, 0, 0], [0, Math.cos(cal.Rot), -Math.sin(cal.Rot)], [0, Math.sin(cal.Rot), Math.cos(cal.Rot)]];
        let l3 = [[Math.cos(cal.UD), 0, Math.sin(cal.UD)], [0, 1, 0], [-Math.sin(cal.UD), 0, Math.cos(cal.UD)]];
        let l4 = [[Math.cos(cal.LR), -Math.sin(cal.LR), 0], [Math.sin(cal.LR), Math.cos(cal.LR), 0], [0, 0, 1]];

        let M_Rot = _ren.fn.matmul(l1, l2);
        M_Rot = _ren.fn.matmul(M_Rot, l3);
        M_Rot = _ren.fn.matmul(M_Rot, l4);
        for(let i = 0; i < pointLength; i++) {
            xyzList[0][i] -= cal.T1;
            xyzList[1][i] -= cal.T2;
            xyzList[2][i] -= cal.T3;
        }
        let XYZc = _ren.fn.matmul(M_Rot, xyzList);
        for(let i = 0; i < pointLength; i++) {
            let xu = XYZc[0][i] / XYZc[2][i];
            let yu = XYZc[1][i] / XYZc[2][i];
            let ru2 = xu ** 2 + yu ** 2;

            let xt = 2 * cal.p1 * xu * yu + cal.p2 * (ru2 + 2 * xu ** 2);
            let yt = cal.p1 * (ru2 + 2 * yu ** 2) + 2 * cal.p2 * xu * yu;
            let xd = (1 + cal.k1 * ru2 + cal.k2 * ru2 ** 2) * xu + xt;
            let yd = (1 + cal.k1 * ru2 + cal.k2 * ru2 ** 2) * yu + yt;

            if(XYZc[2][i] > 0) {
                result.push({
                    "x": cal.fx * xd + cal.cx
                    , "y": cal.fy * yd + cal.cy
                    , "distance": XYZc[2][i]
                });
            } else {
                //
            }
        }
    } else if(cal.type == _ren.constants.CAL_TYPE_HD_02) {
        let XYZ = object.points;
        let pointLength = XYZ[0].length;
        let M_Rot = _ren.fn.typeHd_02ConvertQtoR(cal.w, cal.x, cal.y, cal.z);
        for(let i = 0; i < pointLength; i++) {
            XYZ[0][i] -= cal.t1;
            XYZ[1][i] -= cal.t2;
            XYZ[2][i] -= cal.t3;
        }
        let XYZc = _ren.fn.matmul(M_Rot, XYZ);
        for(let i = 0; i < pointLength; i++) {
            let xu = XYZc[0][i] / XYZc[2][i];
            let yu = XYZc[1][i] / XYZc[2][i];
            let ru2 = xu ** 2 + yu ** 2;
            let r =  Math.sqrt(ru2);
            let theta = Math.atan(r);
            let k = theta * (1 + cal.k1 * theta ** 2 + cal.k2 * theta ** 4 + cal.k3 * theta ** 6 + cal.k4 * theta ** 8) / r;
            let xd = k * xu;
            let yd = k * yu;
            let zp = XYZc[2][i];

            if(zp > 0) {
                result.push({
                    "x": cal.fx * xd + cal.skew * yd + cal.cx
                    , "y": cal.fy * yd + cal.cy
                    , "distance": zp
                });
            } else {
                //
            }
        }
    } else if(cal.type == _ren.constants.CAL_TYPE_HD_03) {
        let xyzList = JSON.parse(JSON.stringify(object.points));
        _ren.temp = {};
        _ren.temp.xyzList = xyzList;
        _ren.temp.object = object;
        _ren.temp.xp = [];
        _ren.temp.yp = [];
        _ren.temp.xd = [];
        _ren.temp.yd = [];
        _ren.temp.cal = cal
        let pointLength = xyzList[0].length;
        let XYZc = _ren.fn.matmul(cal.Rot, xyzList);
        for(let i = 0; i < pointLength; i++) {
            XYZc[0][i] += cal.Translation[0];
            XYZc[1][i] += cal.Translation[1];
            XYZc[2][i] += cal.Translation[2];

            /*
            *   xu = XYZc[0, :] / XYZc[2, :]
                yu = XYZc[1, :] / XYZc[2, :]

                ru2 = xu ** 2 + yu ** 2
                r = np.sqrt(ru2)

                theta = np.arctan(r)
                k = theta * (1 + k1 * theta ** 2 + k2 * theta ** 4 + k3 * theta ** 6 + k4 * theta ** 8) / r

                xd = k * xu
                yd = k * yu

                xp = fx * xd + skew * yd + cx
                yp = fy * yd + cy
            *
            * */
            let xu = XYZc[0][i] / XYZc[2][i];
            let yu = XYZc[1][i] / XYZc[2][i];
            let ru2 = xu ** 2 + yu ** 2;
            let r = Math.sqrt(ru2);
            let theta = Math.atan(r);
            let k;
            if(cal.subType == _ren.constants.CAL_TYPE_HD_03_SUB.v1) {
                k = theta * (1 + cal.k1 * theta ** 2 + cal.k2 * theta ** 4 + cal.k3 * theta ** 6 + cal.k4 * theta ** 8) / r;
            }else if(cal.subType == _ren.constants.CAL_TYPE_HD_03_SUB.v1_3) {
                k = theta * (cal.k0 + cal.k1 * theta ** 2 + cal.k2 * theta ** 4 + cal.k3 * theta ** 6 + cal.k4 * theta ** 8) / r;
            }
            let xd = k * xu;
            let yd = k * yu;
            _ren.temp.xd.push(xd);
            _ren.temp.yd.push(yd);
            let xp = cal.fx * xd + cal.skew * yd + cal.cx;
            let yp = cal.fy * yd + cal.cy

            let zp = XYZc[2][i];
            _ren.temp.xp.push(xp);
            _ren.temp.yp.push(yp);
            if(zp > 0) {
                result.push({
                    "x": xp
                    , "y": yp
                    , "distance": zp
                });
            } else {
                // result.push({
                //     "x": 0
                //     , "y": 0
                //     , "distance": -1
                // });
            }
        }
        // 2024-06-25 조성옥 이전 버전으로 원복(안현민 과정 요청) 시작
        // 수정 로직은 CAL_TYPE_42_POC 유형으로 유지
    } else if(cal.type == _ren.constants.CAL_TYPE_42_01) {
        let xyzList = object.points;
        xyzList = JSON.parse(JSON.stringify(xyzList));
        let pointLength = xyzList[0].length;

        let XYZc = null;
        if(cal.rot[0] == 0) {
            let M_Rot = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
            XYZc = _ren.fn.matmul(M_Rot, xyzList);
            if(XYZc[2][i] > 0) {
                result.push({
                    "x": cal.fx * xd + cal.cx
                    , "y": cal.fy * yd + cal.cy
                    , "distance": XYZc[2][i]
                });
            }
        } else {
            let l1 = [[0, -1, 0], [0, 0, -1], [1, 0, 0]];
            let l2 = [[1, 0, 0], [0, Math.cos(cal.rot[2]), -Math.sin(cal.rot[2])], [0, Math.sin(cal.rot[2]), Math.cos(cal.rot[2])]];
            let l3 = [[Math.cos(cal.rot[1]), 0, Math.sin(cal.rot[1])], [0, 1, 0], [-Math.sin(cal.rot[1]), 0, Math.cos(cal.rot[1])]];
            let l4 = [[Math.cos(cal.rot[0]), -Math.sin(cal.rot[0]), 0], [Math.sin(cal.rot[0]), Math.cos(cal.rot[0]), 0], [0, 0, 1]];

            let M_Rot = _ren.fn.matmul(l1, l2);
            M_Rot = _ren.fn.matmul(M_Rot, l3);
            M_Rot = _ren.fn.matmul(M_Rot, l4);
            let XYZc = _ren.fn.matmul(M_Rot, xyzList);
            for(let i = 0; i < pointLength; i++) {
                xyzList[0][i] -= cal.trans[0];
                xyzList[1][i] -= cal.trans[1];
                xyzList[2][i] -= cal.trans[2];
            }
            for(let i = 0; i < pointLength; i++) {
                let xu = XYZc[0][i] / XYZc[2][i];
                let yu = XYZc[1][i] / XYZc[2][i];
                // let ru2 = xu ** 2 + yu ** 2;

                // let xt = 2 * cal.p1 * xu * yu + cal.p2 * (ru2 + 2 * xu ** 2);
                // let yt = cal.p1 * (ru2 + 2 * yu ** 2) + 2 * cal.p2 * xu * yu;
                // let xd = (1 + cal.k1 * ru2 + cal.k2 * ru2 ** 2) * xu + xt;
                // let yd = (1 + cal.k1 * ru2 + cal.k2 * ru2 ** 2) * yu + yt;
                //
                // let x = cal.fx * xd + cal.cx;
                // let y = cal.fy * yd + cal.cy;

                let x = cal.fx * xu + cal.cx;
                let y = cal.fy * yu + cal.cy;
                let z = XYZc[2][i];

                if(z > 0 && x > 0 && y > 0) {
                    result.push({
                        "x": x
                        , "y": y
                        , "distance": z
                    });
                }
            }
        }
        // 2024-06-25 조성옥 이전 버전으로 원복(안현민 과정 요청) 끝
    } else if(cal.type == _ren.constants.CAL_TYPE_42_2024_01) { // 42Dot_2024_01 신규 유형(신규 타입 추가 요청_20240710 서지원)
        let xyzList = object.points;
        xyzList = JSON.parse(JSON.stringify(xyzList));
        let pointLength = xyzList[0].length;

        let XYZc = null;
        if(cal.rot[0] == 0) {
            let M_Rot = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
            XYZc = _ren.fn.matmul(M_Rot, xyzList);
            if(XYZc[2][i] > 0) {
                result.push({
                    "x": cal.fx * xd + cal.cx
                    , "y": cal.fy * yd + cal.cy
                    , "distance": XYZc[2][i]
                });
            }
        } else {
            let l1 = [[0, -1, 0], [0, 0, -1], [1, 0, 0]];
            let l2 = [[1, 0, 0], [0, Math.cos(cal.rot[2]), -Math.sin(cal.rot[2])], [0, Math.sin(cal.rot[2]), Math.cos(cal.rot[2])]];
            let l3 = [[Math.cos(cal.rot[1]), 0, Math.sin(cal.rot[1])], [0, 1, 0], [-Math.sin(cal.rot[1]), 0, Math.cos(cal.rot[1])]];
            let l4 = [[Math.cos(cal.rot[0]), -Math.sin(cal.rot[0]), 0], [Math.sin(cal.rot[0]), Math.cos(cal.rot[0]), 0], [0, 0, 1]];

            let M_Rot = _ren.fn.matmul(l1, l2);
            M_Rot = _ren.fn.matmul(M_Rot, l3);
            M_Rot = _ren.fn.matmul(M_Rot, l4);
            // 2024-07-11 조성옥 CAL_TYPE_42_01 과 비교 곱셉이 먼저냐 뺄셈이 먼저냐..
            // CAL_TYPE_42_2024_01(뺄셈이 먼저)
            // CAL_TYPE_42_01(곱셈이 먼저)
            for(let i = 0; i < pointLength; i++) {
                xyzList[0][i] -= cal.trans[0];
                xyzList[1][i] -= cal.trans[1];
                xyzList[2][i] -= cal.trans[2];
            }
            let XYZc = _ren.fn.matmul(M_Rot, xyzList);
            // 2024-07-11 조성옥 여기까지

            for(let i = 0; i < pointLength; i++) {
                let xu = XYZc[0][i] / XYZc[2][i];
                let yu = XYZc[1][i] / XYZc[2][i];
                //let ru2 = xu ** 2 + yu ** 2;

                //let xt = 2 * cal.p1 * xu * yu + cal.p2 * (ru2 + 2 * xu ** 2);
                //let yt = cal.p1 * (ru2 + 2 * yu ** 2) + 2 * cal.p2 * xu * yu;
                //let xd = (1 + cal.k1 * ru2 + cal.k2 * ru2 ** 2) * xu + xt;
                //let yd = (1 + cal.k1 * ru2 + cal.k2 * ru2 ** 2) * yu + yt;
                //
                //let x = cal.fx * xd + cal.cx;
                //let y = cal.fy * yd + cal.cy;

                let x = cal.fx * xu + cal.cx;
                let y = cal.fy * yu + cal.cy;
                let z = XYZc[2][i];

                if(z > 0 && x > 0 && y > 0) {
                    result.push({
                        "x": x
                        , "y": y
                        , "distance": z
                    });
                }
            }
        }
    } else if(cal.type == _ren.constants.CAL_TYPE_MOBIS_01) {
        let xyzList = object.points;
        xyzList = JSON.parse(JSON.stringify(xyzList));
        let pointLength = xyzList[0].length;
        for(let i = 0; i < pointLength; i++) {
            xyzList[0][i] -= cal.t1;
            xyzList[1][i] -= cal.t2;
            xyzList[2][i] -= cal.t3;
        }
        let XYZc = _ren.fn.matmul(cal.rot, xyzList);
        for(let i = 0; i < pointLength; i++) {
            let xu = XYZc[0][i] / XYZc[2][i];
            let yu = XYZc[1][i] / XYZc[2][i];

            let ru2 = xu ** 2 + yu ** 2;
            let r = Math.sqrt(ru2);
            let theta = Math.atan(r);
            let k = theta * (1 + cal.k1 * theta ** 2 + cal.k2 * theta ** 4 + cal.k3 * theta ** 6 + cal.k4 * theta ** 8) / r;
            let xd = k * xu;
            let yd = k * yu;
            let zp = XYZc[2][i];

            if(zp > 0) {
                result.push({
                    "x": cal.fx * xd + cal.cx
                    , "y": cal.fy * yd + cal.cy
                    , "distance": zp
                });
            } else {
                //
            }
        }
        // 2024-07-17 조성옥 추가(홍빛나K 요청) 시작
    } else if(cal.type == _ren.constants.CAL_TYPE_MOBIS_2024_POC_01) {
        let xyzList = object.points;
        xyzList = JSON.parse(JSON.stringify(xyzList));
        let pointLength = xyzList[0].length;

        let XYZc = _ren.fn.matmul(cal.rot, xyzList);
        for(let i = 0; i < pointLength; i++) {
            xyzList[0][i] += cal.t1;
            xyzList[1][i] += cal.t2;
            xyzList[2][i] += cal.t3;
        }

        for(let i = 0; i < pointLength; i++) {
            let xu = XYZc[0][i] / XYZc[2][i];
            let yu = XYZc[1][i] / XYZc[2][i];

            let ru2 = xu ** 2 + yu ** 2;
            let r = Math.sqrt(ru2);
            let theta = Math.atan(r);

            let k = theta * (cal.k1 + cal.k2 * theta ** 2 + cal.k3 * theta ** 4 + cal.k4 * theta ** 6 + cal.k5 * theta ** 8) / r;

            let xd = k * xu;
            let yd = k * yu;
            let zp = XYZc[2][i];

            if(zp > 0) {
                result.push({
                    "x": cal.fx * xd + cal.cx
                    , "y": cal.fy * yd + cal.cy
                    , "distance": zp
                });
            } else {
                //
            }
        }
        // 2024-07-17 조성옥 추가(홍빛나K 요청) 끝
    }  else if(cal.type == _ren.constants.CAL_TYPE_LG_01) {
        let xyzList = object.points;
        xyzList = JSON.parse(JSON.stringify(xyzList));
        let pointLength = xyzList[0].length;
        let XYZc = _ren.fn.matmul(cal.rot, xyzList);
        _ren.data.XYZc = XYZc;
        for(let i = 0; i < pointLength; i++) {
            let xu = XYZc[0][i] / XYZc[2][i];
            let yu = XYZc[1][i] / XYZc[2][i];

            result.push({
                "x": cal.fx * xu + cal.cx
                , "y": cal.fy * yu + cal.cy
                , "distance": 1
            });
        }
    }  else if(cal.type == _ren.constants.CAL_TYPE_KITTI) {
        let xyzList = object.points;
        xyzList = JSON.parse(JSON.stringify(xyzList));
        let pointLength = xyzList[0].length;
        let XYZc = _ren.fn.matmul(cal.M_Rot, xyzList);
        for(let i = 0; i < pointLength; i++) {
            XYZc[0][i] + cal.Trans[0];
            XYZc[1][i] + cal.Trans[1];
            XYZc[2][i] + cal.Trans[2];

            let xu = XYZc[0][i] / XYZc[2][i];
            let yu = XYZc[1][i] / XYZc[2][i];
            let bx = cal.P2[0][3] / XYZc[2][i];
            let by = cal.P2[1][3] / XYZc[2][i];
            let tt = {xu:xu, yu:yu, bx:bx, by:by};
            log.info(tt, "tt");
            let xp = cal.fx * xu + cal.cx + bx;
            let yp = cal.fy * yu + cal.cy + by;
            let zp = XYZc[2][i];

            if(xp < 0) xp = 0;
            if(yp < 0) yp = 0;
            if(zp > 0) {
                result.push({
                    "x": xp
                    , "y": yp
                    , "distance": zp
                });
            }
        }
        _ren.data.XYZc = XYZc;
        _ren.data.resultTp = result;
        // 2024-06-25 조성옥 2024-04-05 수정 로직 CAL_TYPE_42_POC 유형으로 유지 시작
    } else if(cal.type == _ren.constants.CAL_TYPE_42_POC) { // 42DOC POC
        let xyzList = object.points;
        xyzList = JSON.parse(JSON.stringify(xyzList));
        let pointLength = xyzList[0].length;

        let XYZc = null;
        if(cal.rot[0] == 0) {
            let M_Rot = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
            XYZc = _ren.fn.matmul(M_Rot, xyzList);
            if(XYZc[2][i] > 0) {
                result.push({
                    "x": cal.fx * xd + cal.cx
                    , "y": cal.fy * yd + cal.cy
                    , "distance": XYZc[2][i]
                });
            }
        } else {
            let l1 = [[0, -1, 0], [0, 0, -1], [1, 0, 0]];
            let l2 = [[1, 0, 0], [0, Math.cos(cal.rot[2]), -Math.sin(cal.rot[2])], [0, Math.sin(cal.rot[2]), Math.cos(cal.rot[2])]];
            let l3 = [[Math.cos(cal.rot[1]), 0, Math.sin(cal.rot[1])], [0, 1, 0], [-Math.sin(cal.rot[1]), 0, Math.cos(cal.rot[1])]];
            let l4 = [[Math.cos(cal.rot[0]), -Math.sin(cal.rot[0]), 0], [Math.sin(cal.rot[0]), Math.cos(cal.rot[0]), 0], [0, 0, 1]];

            let M_Rot = _ren.fn.matmul(l1, l2);
            M_Rot = _ren.fn.matmul(M_Rot, l3);
            M_Rot = _ren.fn.matmul(M_Rot, l4);

            for(let i = 0; i < pointLength; i++) {
                xyzList[0][i] -= cal.trans[0];
                xyzList[1][i] -= cal.trans[1];
                xyzList[2][i] -= cal.trans[2];
            }
            let XYZc = _ren.fn.matmul(M_Rot, xyzList);
            for(let i = 0; i < pointLength; i++) {
                let xu = XYZc[0][i] / XYZc[2][i];
                let yu = XYZc[1][i] / XYZc[2][i];

                // 2024/04/05 왜곡보정 추가적용 시작
                let ru2 = xu ** 2 + yu ** 2;

                let xt = 2 * cal.p1 * xu * yu + cal.p2 * (ru2 + 2 * xu ** 2);
                let yt = cal.p1 * (ru2 + 2 * yu ** 2) + 2 * cal.p2 * xu * yu;
                let xd = (1 + cal.k1 * ru2 + cal.k2 * ru2 ** 2) * xu + xt;
                let yd = (1 + cal.k1 * ru2 + cal.k2 * ru2 ** 2) * yu + yt;

                let x = cal.fx * xd + cal.cx;
                let y = cal.fy * yd + cal.cy;
                //let x = cal.fx * xu + cal.cx;
                //let y = cal.fy * yu + cal.cy;
                // 2024/04/05 왜곡보정 추가적용 끝

                let z = XYZc[2][i];

                if(z > 0 && x > 0 && y > 0) {
                    result.push({
                        "x": x
                        , "y": y
                        , "distance": z
                    });
                }
            }
        }
        // 2024-06-25 조성옥 2024-04-05 수정 로직 CAL_TYPE_42_POC 유형으로 유지 끝
    } else if(cal.type == _ren.constants.CAL_TYPE_WOOWAHAN_00) { // 우아한형제들 POC
        // 2024-08-22 조성옥 ONLY PCD 작업을 위한 TYPE 추가
    } else if(cal.type == _ren.constants.CAL_TYPE_ONLY_PCD) { // CAL_TYPE_ONLY_PCD
    } else if(cal.type == _ren.constants.CAL_TYPE_OTOKAR) {
        let xyzList = JSON.parse(JSON.stringify(object.points));
        _ren.temp = {};
        _ren.temp.xyzList = xyzList;
        _ren.temp.object = object;
        _ren.temp.xp = [];
        _ren.temp.yp = [];
        _ren.temp.xd = [];
        _ren.temp.yd = [];
        _ren.temp.cal = cal
        let pointLength = xyzList[0].length;
        let XYZc = _ren.fn.matmul(cal.Rot, xyzList);
        for(let i = 0; i < pointLength; i++) {
            XYZc[0][i] += cal.Translation[0];
            XYZc[1][i] += cal.Translation[1];
            XYZc[2][i] += cal.Translation[2];

            let xu = XYZc[0][i] / XYZc[2][i];
            let yu = XYZc[1][i] / XYZc[2][i];
            let ru2 = xu ** 2 + yu ** 2;

            let xt = 2 * cal.p1 * xu * yu + cal.p2 * (ru2 + 2 * xu**2);
            let yt = cal.p1 * (ru2 + 2 * yu**2) + 2 * cal.p2 * xu * yu;

            let xd = (1 + cal.k1 * ru2 + cal.k2 * ru2**2) * xu + xt;
            let yd = (1 + cal.k1 * ru2 + cal.k2 * ru2**2) * yu + yt;
            _ren.temp.xd.push(xd);
            _ren.temp.yd.push(yd);

            let xp = cal.fx * xd + cal.cx;
            let yp = cal.fy * yd + cal.cy
            _ren.temp.xp.push(xp);
            _ren.temp.yp.push(yp);

            let zp = XYZc[2][i];

            if(zp > 0) {
                result.push({
                    "x": xp
                    , "y": yp
                    , "distance": zp
                });
            }
        }
        // 2024-12-17 추가 AirportPJT 용 Cal Type (이상록대리 요청) - 임시 Cal(축변환이 된 유형)
    } else if(cal.type == _ren.constants.CAL_TYPE_HD_04_TEMP) {
        let xyzList = JSON.parse(JSON.stringify(object.points));
        _ren.temp = {};
        _ren.temp.xyzList = xyzList;
        _ren.temp.object = object;
        _ren.temp.xp = [];
        _ren.temp.yp = [];
        _ren.temp.xd = [];
        _ren.temp.yd = [];
        _ren.temp.cal = cal
        let pointLength = xyzList[0].length;
        let XYZc = _ren.fn.matmul(cal.Rot, xyzList);
        for(let i = 0; i < pointLength; i++) {
            XYZc[0][i] += cal.Translation[0];
            XYZc[1][i] += cal.Translation[1];
            XYZc[2][i] += cal.Translation[2];

            let xu = XYZc[0][i] / XYZc[2][i];
            let yu = XYZc[1][i] / XYZc[2][i];
            let ru2 = xu ** 2 + yu ** 2;
            let r = Math.sqrt(ru2);
            let theta = Math.atan(r);
            let k = theta * (cal.k0 + cal.k1 * theta ** 2 + cal.k2 * theta ** 4 + cal.k3 * theta ** 6 + cal.k4 * theta ** 8) / r;

            let xd = k * xu;
            let yd = k * yu;
            _ren.temp.xd.push(xd);
            _ren.temp.yd.push(yd);
            let xp = cal.fx * xd + cal.skew * yd + cal.cx;
            let yp = cal.fy * yd + cal.cy

            let zp = XYZc[2][i];
            _ren.temp.xp.push(xp);
            _ren.temp.yp.push(yp);
            if(zp > 0) {
                result.push({
                    "x": xp
                    , "y": yp
                    , "distance": zp
                });
            } else {
                console.log("ERROR", zp);
                // result.push({
                //     "x": 0
                //     , "y": 0
                //     , "distance": -1
                // });
            }
        }
        // 2024-12-24 추가 AirportPJT 용 Cal Type (이상록대리 요청) - 정상 축
    } else if(cal.type == _ren.constants.CAL_TYPE_HD_04_NEW) {
        let xyzList = JSON.parse(JSON.stringify(object.points));
        _ren.temp = {};
        _ren.temp.xyzList = xyzList;
        _ren.temp.object = object;
        _ren.temp.xp = [];
        _ren.temp.yp = [];
        _ren.temp.xd = [];
        _ren.temp.yd = [];
        _ren.temp.cal = cal
        let pointLength = xyzList[0].length;
        let XYZc = _ren.fn.matmul(cal.Rot, xyzList);
        for(let i = 0; i < pointLength; i++) {
            XYZc[0][i] += cal.Translation[0];
            XYZc[1][i] += cal.Translation[1];
            XYZc[2][i] += cal.Translation[2];

            let xu = XYZc[0][i] / XYZc[2][i];
            let yu = XYZc[1][i] / XYZc[2][i];
            let ru2 = xu ** 2 + yu ** 2;
            let r = Math.sqrt(ru2);
            let theta = Math.atan(r);
            let k = theta * (cal.k0 + cal.k1 * theta ** 2 + cal.k2 * theta ** 4 + cal.k3 * theta ** 6 + cal.k4 * theta ** 8) / r;

            let xd = k * xu;
            let yd = k * yu;
            _ren.temp.xd.push(xd);
            _ren.temp.yd.push(yd);
            let xp = cal.fx * xd + cal.skew * yd + cal.cx;
            let yp = cal.fy * yd + cal.cy

            let zp = XYZc[2][i];
            _ren.temp.xp.push(xp);
            _ren.temp.yp.push(yp);
            if(zp > 0) {
                result.push({
                    "x": xp
                    , "y": yp
                    , "distance": zp
                });
            } else {
                console.log("ERROR", zp);
                // result.push({
                //     "x": 0
                //     , "y": 0
                //     , "distance": -1
                // });
            }
        }
        // 2024-12-20 추가 FR camera recognition 3D 신규과제 Cal Type (이성민과장 요청)
    } else if(cal.type == _ren.constants.CAL_TYPE_HD_POC_2024_01) {
        let XYZ_1 = JSON.parse(JSON.stringify(object.points));

        _ren.temp = {};
        _ren.temp.xyzList = XYZ_1;
        _ren.temp.object = object;
        _ren.temp.xp = [];
        _ren.temp.yp = [];
        _ren.temp.xd = [];
        _ren.temp.yd = [];
        _ren.temp.cal = cal

        let _tempMap = [[0,0,1],[0,-1,0],[1,0,0]];

        XYZ_1 = _ren.fn.matmul(_tempMap, XYZ_1);
        for(let i = 0; i < XYZ_1[0].length; i++) {
            XYZ_1[0][i] -= cal.Translation_1[0];
            XYZ_1[1][i] -= cal.Translation_1[1];
            XYZ_1[2][i] -= cal.Translation_1[2];
        }
        let XYZ = _ren.fn.matmul(cal.Rot_1, XYZ_1);

        let XYZc = _ren.fn.matmul(cal.Rot, XYZ);
        for(let i = 0; i < XYZc[0].length; i++) {
            XYZc[0][i] += cal.Translation[0];
            XYZc[1][i] += cal.Translation[1];
            XYZc[2][i] += cal.Translation[2];

            let xu = XYZc[0][i] / XYZc[2][i];
            let yu = XYZc[1][i] / XYZc[2][i];
            let ru2 = xu ** 2 + yu ** 2;
            let r = Math.sqrt(ru2);
            let theta = Math.atan(r);
            let k = theta * (cal.k0 + cal.k1 * theta ** 2 + cal.k2 * theta ** 4 + cal.k3 * theta ** 6 + cal.k4 * theta ** 8) / r;

            let xd = k * xu;
            let yd = k * yu;
            _ren.temp.xd.push(xd);
            _ren.temp.yd.push(yd);
            let xp = cal.fx * xd + cal.skew * yd + cal.cx;
            let yp = cal.fy * yd + cal.cy

            let zp = XYZc[2][i];
            _ren.temp.xp.push(xp);
            _ren.temp.yp.push(yp);
            if(zp > 0) {
                result.push({
                    "x": xp
                    , "y": yp
                    , "distance": zp
                });
            } else {
                // result.push({
                //     "x": 0
                //     , "y": 0
                //     , "distance": -1
                // });
            }
        }
        // 2025-03-04 추가 NaverLabs Cal Type (한형진차장 요청)
    } else if(cal.type == _ren.constants.CAL_TYPE_NAVERLABS_2025_01) {
        let XYZ = JSON.parse(JSON.stringify(object.points));

//            XYZ = np.asarray(pcd.points).T
//
//            '''calibration'''
//            XYZc = np.linalg.inv(Rot) @ (XYZ - Trans)
//
//            xu = XYZc[0,:] / XYZc[2,:]
//            yu = XYZc[1,:] / XYZc[2,:]
//
//            xp = fx * xu + skew * yu + cx
//            yp = fy * yu + cy
//            zp = XYZc[2,:]
//
//            xp_re = np.int16(xp)
//            yp_re = np.int16(yp)
//            zp_re = np.int16(zp)

        for(let i = 0; i < XYZ[0].length; i++) {
            XYZ[0][i] -= cal.Trans[0];
            XYZ[1][i] -= cal.Trans[1];
            XYZ[2][i] -= cal.Trans[2];
        }

        let XYZc = _ren.fn.matmul(math.inv(cal.Rot), XYZ);
        for(let i = 0; i < XYZc[0].length; i++) {
            let xu = XYZc[0][i] / XYZc[2][i];
            let yu = XYZc[1][i] / XYZc[2][i];

            let xp = cal.fx * xu + cal.skew * yu + cal.cx;
            let yp = cal.fy * yu + cal.cy;
            let zp = XYZc[2][i];

            if(zp > 0) {
                result.push({
                    "x": xp
                    , "y": yp
                    , "distance": zp
                });
            }
        }
    }
    return result;
}
_ren.fn.listAvg = function(listNum) {
    return listNum.reduce((a, b) => a + b, 0) / listNum.length;
}
_ren.fn.calcPixel = function(object, cal) {
    return {
        objectType      : object.objectType
        , pointList     : _ren.fn.calcPixelSimple(object, cal)
        , isFill        : object.isFill
        , isDot         : object.isDot
        , isLine        : object.isLine
        , originPointList: object.points
        , fillColor     : object.fillColor
        , fillOpacity   : object.fillOpacity
        , lineColor     : object.lineColor
        , lineWidth     : object.lineWidth
        , lineOpacity   : object.lineOpacity
        , isRotation    : object.isRotation
        , rotationColor : object.rotationColor
        , rotationOpacity: object.rotationOpacity
        , xyzList       : object.points
        , centerPosition       : object.centerPosition
    };
}

_ren.fn.convertCalibrationValues = function(calibrationTxt) {
    //log.info(calibrationTxt, "_ren.fn.convertCalibrationValues")
    _ren.data.calibrationTxt = calibrationTxt;
    let cal = null;
    try {
        calibrationTxt = calibrationTxt.replace(/`/gi, "\"").replace(/‡/gi, "\"");
        let lines = calibrationTxt.split("|");
        _ren.data.calibrationTxt = calibrationTxt;

        if (calibrationTxt.indexOf(_ren.constants.CAL_TYPE_HD_03) > 0) {
            cal = JSON.parse(calibrationTxt.replace(/\|/gi, ""));
            cal.type = cal.TYPE;
            cal.Distortion = cal.Distortion.split(",").map(Number);
            cal.Intrinsic = cal.Intrinsic.split(",").map(Number);
            cal.Rotation = cal.Rotation.split(",").map(Number);
            cal.Translation = cal.Translation.split(",").map(Number);

            cal.fx = cal.Intrinsic[0];
            cal.skew = cal.Intrinsic[1];
            cal.cx = cal.Intrinsic[2];
            cal.fy = cal.Intrinsic[4];
            cal.cy = cal.Intrinsic[5];
            if (cal.Distortion.length == 4) {
                cal.k1 = cal.Distortion[0];
                cal.k2 = cal.Distortion[1];
                cal.k3 = cal.Distortion[2];
                cal.k4 = cal.Distortion[3];
                cal.subType = _ren.constants.CAL_TYPE_HD_03_SUB.v1;
            } else if (cal.Distortion.length == 5) {
                cal.k0 = cal.Distortion[0];
                cal.k1 = cal.Distortion[1];
                cal.k2 = cal.Distortion[2];
                cal.k3 = cal.Distortion[3];
                cal.k4 = cal.Distortion[4];
                cal.subType = _ren.constants.CAL_TYPE_HD_03_SUB.v1_3;
            } else {
                throw "This calibration file has wrong distortion.";
            }

            cal.Rot = [
                [
                    cal.Rotation[0], cal.Rotation[1], cal.Rotation[2]
                ], [
                    cal.Rotation[3], cal.Rotation[4], cal.Rotation[5]
                ], [
                    cal.Rotation[6], cal.Rotation[7], cal.Rotation[8]
                ]
            ];
            log.info(cal, "_ren.fn.convertCalibrationValues, " + _ren.constants.CAL_TYPE_HD_03);
        } else if (lines.length >= 8 && lines[3].trim().startsWith("Quaternion")) {
            //hd
            let line4 = lines[4].trim().split(",");
            let line6 = lines[6].trim().split(",");
            let line8 = lines[8].trim().split(",");
            cal = {
                type: _ren.constants.CAL_TYPE_HD_02
                , w: parseFloat(line4[0])
                , x: parseFloat(line4[1])
                , y: parseFloat(line4[2])
                , z: parseFloat(line4[3])
                , t1: parseFloat(line6[0])
                , t2: parseFloat(line6[1])
                , t3: parseFloat(line6[2])
                , fx: parseFloat(line8[0])
                , fy: parseFloat(line8[1])
                , cx: parseFloat(line8[2])
                , cy: parseFloat(line8[3])
                , k1: parseFloat(line8[4])
                , k2: parseFloat(line8[5])
                , k3: parseFloat(line8[6])
                , k4: parseFloat(line8[7])
                , skew: parseFloat(line8[8])
            };
        } else if (lines.length >= 8 && lines[3].trim().startsWith("Angle")) {
            //hd 통합과제 1차
            let line5 = lines[4].trim().split(",");
            let line7 = lines[6].trim().split(",");
            let line9 = lines[8].trim().split(",");
            if (line9.length == 8) {
                cal = {
                    LR: parseFloat(line5[0]), UD: parseFloat(line5[1]), Rot: parseFloat(line5[2])
                    , T1: parseFloat(line7[0]), T2: parseFloat(line7[1]), T3: parseFloat(line7[2])
                    , fx: parseFloat(line9[0]), fy: parseFloat(line9[1]), cx: parseFloat(line9[2])
                    , cy: parseFloat(line9[3]), k1: parseFloat(line9[4]), k2: parseFloat(line9[5])
                    , p1: parseFloat(line9[6]), p2: parseFloat(line9[7])
                    , type: _ren.constants.CAL_TYPE_HD_01
                };
            }
        } else if (lines.length > 5 && (lines[0].startsWith("sensor: "))) { //42Dot
            if (!_ren.constants.isCalError) {
                _ren.constants.isCalError = true;
                log.info(lines, "_ren.fn.convertCalibrationValues, convert 42dot");
            }
            let startIdxLidar = -1;
            let startIdxCamera = -1;
            let idx = 0;
            lines.forEach(function (l) {
                if (l.startsWith("sensor: lidar")) {
                    startIdxLidar = idx;
                } else if (l.startsWith("sensor: camera")) {
                    startIdxCamera = idx;
                }
                idx++;
            });
            cal = {};
            cal.type = _ren.constants.CAL_TYPE_42_01;
            let cal_lidar = _ren.fn.convertCal42dotLidar(lines, startIdxLidar);
            let cal_camera = _ren.fn.convertCal42dotCamera(lines, startIdxCamera);
            cal.trans = [
                cal_camera.x - cal_lidar.z
                , cal_camera.y - cal_lidar.y
                , cal_camera.z - cal_lidar.z
            ];
            cal.rot = [
                Math.radians(cal_lidar.yaw - cal_camera.yaw)
                , Math.radians(cal_lidar.pitch - cal_camera.pitch)
                , Math.radians(cal_lidar.roll - cal_camera.roll)
            ];
            cal.k1 = cal_camera.distortion[0];
            cal.k2 = cal_camera.distortion[1];

            // 2024-06-25 조성옥 이전 버전으로 원복(안현민 과정 요청)
            // 2024-04-05 조성옥 이전 Orginal 시작
            cal.k3 = cal_camera.distortion[2];
            cal.p1 = cal_camera.distortion[3];
            cal.p2 = cal_camera.distortion[4];
            // 2024-04-05 조성옥 이전 Orginal 끝
            // 2024-04-05 조성옥 수정 시작
            // cal.k3 = cal_camera.distortion[4];
            // cal.p1 = cal_camera.distortion[2];
            // cal.p2 = cal_camera.distortion[3];
            // 2024-04-05 조성옥 수정 끝

            cal.fx = cal_camera.fx;
            cal.fy = cal_camera.fy;
            cal.cx = cal_camera.cx;
            cal.cy = cal_camera.cy;
            log.info(cal, "cal for 42dot");
        } else if (lines.length > 5 && (lines[0].startsWith("CAL_TYPE_42_2024_01"))) { // 42Dot_2024_01 신규 유형(산식변경은 없지만 신규 타입 추가 요청_20240710 서지원)
            if (!_ren.constants.isCalError) {
                _ren.constants.isCalError = true;
                log.info(lines, "_ren.fn.convertCalibrationValues, convert 42dot_2024_01");
            }
            let startIdxLidar = -1;
            let startIdxCamera = -1;
            let idx = 0;
            lines.forEach(function (l) {
                if (l.startsWith("sensor: lidar")) {
                    startIdxLidar = idx;//0
                } else if (l.startsWith("sensor: camera")) {
                    startIdxCamera = idx;
                }
                idx++;
            });
            cal = {};
            cal.type = _ren.constants.CAL_TYPE_42_2024_01;
            let cal_lidar = _ren.fn.convertCal42dotLidar(lines, startIdxLidar);
            let cal_camera = _ren.fn.convertCal42dotCamera(lines, startIdxCamera);
            cal.trans = [
                cal_camera.x
                , cal_camera.y
                , cal_camera.z
            ];
            cal.rot = [
                Math.radians(cal_lidar.yaw - cal_camera.yaw)
                , Math.radians(cal_lidar.pitch - cal_camera.pitch)
                , Math.radians(cal_lidar.roll - cal_camera.roll)
            ];
            cal.k1 = cal_camera.distortion[0];
            cal.k2 = cal_camera.distortion[1];

            // 2024-06-25 조성옥 이전 버전으로 원복(안현민 과정 요청)
            // 2024-04-05 조성옥 이전 Orginal 시작
            cal.k3 = cal_camera.distortion[2];
            cal.p1 = cal_camera.distortion[3];
            cal.p2 = cal_camera.distortion[4];
            // 2024-04-05 조성옥 이전 Orginal 끝
            // 2024-04-05 조성옥 수정 시작
            //cal.k3 = cal_camera.distortion[4];
            //cal.p1 = cal_camera.distortion[2];
            //cal.p2 = cal_camera.distortion[3];
            // 2024-04-05 조성옥 수정 끝

            cal.fx = cal_camera.fx;
            cal.fy = cal_camera.fy;
            cal.cx = cal_camera.cx;
            cal.cy = cal_camera.cy;
            log.info(cal, "cal for 42dot_2024_01");
        } else if (lines.length >= 15 && lines[1].trim().startsWith('"PROJECTION_MATRIX"')) {
            cal = {};
            cal.type = _ren.constants.CAL_TYPE_MOBIS_01;
            let calTxt = calibrationTxt.replace(/\|/gi, '');
            try {
                let calj = JSON.parse(calTxt);
                log.info(calj);
                _ren.data.calj = calj;

                cal.rot = [
                    [calj.PROJECTION_MATRIX[0][0], calj.PROJECTION_MATRIX[0][1], calj.PROJECTION_MATRIX[0][2]]
                    , [calj.PROJECTION_MATRIX[1][0], calj.PROJECTION_MATRIX[1][1], calj.PROJECTION_MATRIX[1][2]]
                    , [calj.PROJECTION_MATRIX[2][0], calj.PROJECTION_MATRIX[2][1], calj.PROJECTION_MATRIX[2][2]]
                ];
                cal.trans = [calj.PROJECTION_MATRIX[0][3], calj.PROJECTION_MATRIX[1][3], calj.PROJECTION_MATRIX[2][3]];
                cal.t1 = cal.trans[0];
                cal.t2 = cal.trans[1];
                cal.t3 = cal.trans[2];
                cal.k1 = calj.DISTORTION_COEFFICIENTS[0];
                cal.k2 = calj.DISTORTION_COEFFICIENTS[1];
                cal.k3 = calj.DISTORTION_COEFFICIENTS[2];
                cal.k4 = calj.DISTORTION_COEFFICIENTS[3];
                cal.fx = calj.INTRINSIC_MATRIX[0][0];
                cal.fy = calj.INTRINSIC_MATRIX[1][1];
                cal.cx = calj.INTRINSIC_MATRIX[0][2];
                cal.cy = calj.INTRINSIC_MATRIX[1][2];
            } catch (E) {
                log.error(calTxt);
            }
            // 2024-07-17 조성옥 추가(홍빛나K 요청) 시작
        } else if (lines.length >= 15 && lines[0].trim().startsWith('CAL_TYPE_MOBIS_2024_POC_01')) {
            cal = {};
            cal.type = _ren.constants.CAL_TYPE_MOBIS_2024_POC_01;
            try {
                let calTxt = '';
                for(let idx = 1; idx < lines.length; idx++){
                    console.log(lines[idx]);
                    calTxt = calTxt + lines[idx];
                }
                let calj = JSON.parse(calTxt);
                log.info(calj);
                _ren.data.calj = calj;

                cal.rot = [
                    [calj[13], calj[14], calj[15]]
                    , [calj[16], calj[17], calj[18]]
                    , [calj[19], calj[20], calj[21]]
                ];

                cal.trans = [calj[10]/1000, calj[11]/1000, calj[12]/1000];

                cal.t1 = cal.trans[0];
                cal.t2 = cal.trans[1];
                cal.t3 = cal.trans[2];

                cal.k1 = calj[4];
                cal.k2 = calj[5];
                cal.k3 = calj[6];
                cal.k4 = calj[7];
                cal.k5 = calj[8];

                cal.fx = calj[0];
                cal.fy = calj[1];

                cal.cx = calj[2];
                cal.cy = calj[3];
            } catch (E) {
                log.error(calTxt);
            }
            // 2024-07-17 조성옥 추가(홍빛나K 요청) 끝
        } else if (_common.isNotEmpty(calibrationTxt) && calibrationTxt.trim().replace(/ /gi, '').startsWith(_ren.constants.CAL_TYPE_LG_01)) {
            let calj = JSON.parse(calibrationTxt.replace(/\|/gi, ''));
            calj = calj[0];
            _ren.data.calj = calj;
            //camera_external
            //camera_internal
            cal = {};
            cal.type = _ren.constants.CAL_TYPE_LG_01;
            cal.cx = calj.camera_internal.cx;
            cal.cy = calj.camera_internal.cy;
            cal.fx = calj.camera_internal.fx;
            cal.fy = calj.camera_internal.fy;
            cal.rot = [];
            for (let i = 0; i < 12; i += 4) {
                cal.rot.push([
                    calj.camera_external[i]
                    , calj.camera_external[i + 1]
                    , calj.camera_external[i + 2]
                ]);
            }
        } else if(_common.isNotEmpty(calibrationTxt) && calibrationTxt.trim().startsWith(_ren.constants.CAL_TYPE_KITTI)) {
            let tempCal = calibrationTxt.trim().split("|");
            log.info(tempCal, "tempCal");
            let json = {};
            let keys = ["P0", "P1", "P2", "P3", "Tr"];
            cal = {};
            cal.type = _ren.constants.CAL_TYPE_KITTI;
            for(let line of tempCal) {
                line = line.replace(": ", "");
                for(let key of keys) {
                    if(line.toUpperCase().startsWith(key.toUpperCase())) {
                        json[key] = line.replace(key, "").split(" ");
                        for(let i = 0; i < json[key].length; i++) {
                            json[key][i] = _ren.fn.parseScientificNotation(json[key][i]);
                        }
                    }
                }
            }
            log.info(json, "json");
            let p2 = _ren.fn.covertDimArray(json["P2"], 4);
            cal.P2 = _ren.fn.covertDimArray(json["P2"], 4);
            cal.fx = p2[0][0];
            cal.fy = p2[1][1];
            cal.cx = p2[0][2];
            cal.cy = p2[1][2];
            cal.M_Rot = _ren.fn.covertDimArray(json["Tr"], 4);
            cal.Trans = [];
            for(let l of cal.M_Rot) {
                cal.Trans.push(l.pop());
            }
            log.info(cal, "cal");
        } else if(_common.isNotEmpty(calibrationTxt) && calibrationTxt.trim().startsWith("CAL_TYPE_42_POC")) { // 42DOC POC
            cal = {};
            cal.type = _ren.constants.CAL_TYPE_42_POC;
            log.info(cal, "cal");
        } else if(_common.isNotEmpty(calibrationTxt) && calibrationTxt.trim().startsWith("/**:")) { // 우아한형제들 POC
            cal = {};
            cal.type = _ren.constants.CAL_TYPE_WOOWAHAN_00;
            log.info(cal, "cal");
        } else if (calibrationTxt.indexOf(_ren.constants.CAL_TYPE_OTOKAR) > 0) {
            cal = JSON.parse(calibrationTxt.replace(/\|/gi, ""));
            cal.type = cal.TYPE;
            cal.Distortion = cal.Distortion.split(",").map(Number);
            cal.Intrinsic = cal.Intrinsic.split(",").map(Number);
            cal.Rotation = cal.Rotation.split(",").map(Number);
            cal.Translation = cal.Translation.split(",").map(Number);

            cal.fx = cal.Intrinsic[0];
            cal.fy = cal.Intrinsic[1];
            cal.cx = cal.Intrinsic[2];
            cal.cy = cal.Intrinsic[3];

            cal.k1 = cal.Distortion[0];
            cal.k2 = cal.Distortion[1];
            cal.p1 = cal.Distortion[2];
            cal.p2 = cal.Distortion[3];
            cal.k3 = cal.Distortion[4];

            cal.Rot = [
                [
                    cal.Rotation[0], cal.Rotation[1], cal.Rotation[2]
                ], [
                    cal.Rotation[3], cal.Rotation[4], cal.Rotation[5]
                ], [
                    cal.Rotation[6], cal.Rotation[7], cal.Rotation[8]
                ]
            ];
            log.info(cal, "_ren.fn.convertCalibrationValues, " + _ren.constants.CAL_TYPE_OTOKAR);
            // 2024-08-22 조성옥 ONLY PCD 작업을 위한 TYPE 추가
        } else if(_common.isNotEmpty(calibrationTxt) && calibrationTxt.trim().startsWith("NO_CALIBRATION")) {
            cal = {};
            cal.type = _ren.constants.CAL_TYPE_ONLY_PCD;
            // 2024-12-17 추가 AirportPJT 용 Cal Type (이상록대리 요청) - 임시 Cal(축변환이 된 유형)
        } else if (calibrationTxt.indexOf(_ren.constants.CAL_TYPE_HD_04_TEMP) > 0) {
            cal = JSON.parse(calibrationTxt.replace(/\|/gi, ""));
            cal.type = _ren.constants.CAL_TYPE_HD_04_TEMP;
            cal.Distortion = cal.Distortion.split(",").map(Number);
            cal.Intrinsic = cal.Intrinsic.split(",").map(Number);
            cal.Rotation = cal.Rotation.split(",").map(Number);
            cal.Translation = cal.Translation.split(",").map(Number);

            cal.fx = cal.Intrinsic[0];
            cal.skew = cal.Intrinsic[1];
            cal.cx = cal.Intrinsic[2];
            cal.fy = cal.Intrinsic[4];
            cal.cy = cal.Intrinsic[5];

            if (cal.Distortion.length == 5) {
                cal.k0 = cal.Distortion[0];
                cal.k1 = cal.Distortion[1];
                cal.k2 = cal.Distortion[2];
                cal.k3 = cal.Distortion[3];
                cal.k4 = cal.Distortion[4];
            } else {
                throw "This calibration file has wrong distortion.";
            }

            cal.Rot = [
                [
                    cal.Rotation[0], cal.Rotation[1], cal.Rotation[2]
                ], [
                    cal.Rotation[3], cal.Rotation[4], cal.Rotation[5]
                ], [
                    cal.Rotation[6], cal.Rotation[7], cal.Rotation[8]
                ]
            ];
            log.info(cal, "_ren.fn.convertCalibrationValues, " + _ren.constants.CAL_TYPE_HD_04_TEMP);
            // 2024-12-24 추가 AirportPJT 용 Cal Type (이상록대리 요청) - 정상 축
        } else if (calibrationTxt.indexOf(_ren.constants.CAL_TYPE_HD_04_NEW) > 0) {
            cal = JSON.parse(calibrationTxt.replace(/\|/gi, ""));
            cal.type = _ren.constants.CAL_TYPE_HD_04_NEW;
            cal.Distortion = cal.Distortion.split(",").map(Number);
            cal.Intrinsic = cal.Intrinsic.split(",").map(Number);
            cal.Rotation = cal.Rotation.split(",").map(Number);
            cal.Translation = cal.Translation.split(",").map(Number);

            cal.fx = cal.Intrinsic[0];
            cal.skew = cal.Intrinsic[1];
            cal.cx = cal.Intrinsic[2];
            cal.fy = cal.Intrinsic[4];
            cal.cy = cal.Intrinsic[5];

            if (cal.Distortion.length == 5) {
                cal.k0 = cal.Distortion[0];
                cal.k1 = cal.Distortion[1];
                cal.k2 = cal.Distortion[2];
                cal.k3 = cal.Distortion[3];
                cal.k4 = cal.Distortion[4];
            } else {
                throw "This calibration file has wrong distortion.";
            }

            cal.Rot = [
                [
                    cal.Rotation[0], cal.Rotation[1], cal.Rotation[2]
                ], [
                    cal.Rotation[3], cal.Rotation[4], cal.Rotation[5]
                ], [
                    cal.Rotation[6], cal.Rotation[7], cal.Rotation[8]
                ]
            ];
            log.info(cal, "_ren.fn.convertCalibrationValues, " + _ren.constants.CAL_TYPE_HD_04_NEW);
            // 2024-12-20 추가 FR camera recognition 3D 신규과제 Cal Type (이성민과장 요청)
        } else if (calibrationTxt.indexOf(_ren.constants.CAL_TYPE_HD_POC_2024_01) > 0) {
            cal = JSON.parse(calibrationTxt.replace(/\|/gi, ""));
            cal.type = _ren.constants.CAL_TYPE_HD_POC_2024_01;

            cal.Intrinsic = cal.Intrinsic.split(",").map(Number);
            cal.fx = cal.Intrinsic[0];
            cal.skew = cal.Intrinsic[1];
            cal.cx = cal.Intrinsic[2];
            cal.fy = cal.Intrinsic[4];
            cal.cy = cal.Intrinsic[5];

            cal.Distortion = cal.Distortion.split(",").map(Number);
            cal.k0 = cal.Distortion[0];
            cal.k1 = cal.Distortion[1];
            cal.k2 = cal.Distortion[2];
            cal.k3 = cal.Distortion[3];
            cal.k4 = cal.Distortion[4];

            cal.Rotation = cal.ExtrinsicInfo[0].Rotation.split(",").map(Number);
            cal.Translation = cal.ExtrinsicInfo[0].Translation.split(",").map(Number);
            cal.Rot = [
                [cal.Rotation[0], cal.Rotation[1], cal.Rotation[2]]
                , [cal.Rotation[3], cal.Rotation[4], cal.Rotation[5]]
                , [cal.Rotation[6], cal.Rotation[7], cal.Rotation[8]]
            ];

            cal.Rotation_1 = cal.ExtrinsicInfo[1].Rotation.split(",").map(Number);
            cal.Translation_1 = cal.ExtrinsicInfo[1].Translation.split(",").map(Number);
            cal.Rot_1 = [
                [cal.Rotation_1[0], cal.Rotation_1[3], cal.Rotation_1[6]]
                , [cal.Rotation_1[1], cal.Rotation_1[4], cal.Rotation_1[7]]
                , [cal.Rotation_1[2], cal.Rotation_1[5], cal.Rotation_1[8]]
            ];

            log.info(cal, "_ren.fn.convertCalibrationValues, " + _ren.constants.CAL_TYPE_HD_POC_2024_01);
            // 2025-03-04 추가 NaverLabs Cal Type (한형진차장 요청)
        } else if (calibrationTxt.indexOf(_ren.constants.CAL_TYPE_NAVERLABS_2025_01) > 0) {
            cal = JSON.parse(calibrationTxt.replace(/\|/gi, ""));
            cal.type = _ren.constants.CAL_TYPE_NAVERLABS_2025_01;

            var q_w = cal.rotation[0];
            var q_x = cal.rotation[1];
            var q_y = cal.rotation[2];
            var q_z = cal.rotation[3];
            cal.Rot = _ren.fn.type_NaverLab_ConvertQtoR(q_w, q_x, q_y, q_z);

            cal.Trans = [[cal.translation[0]]
                ,[cal.translation[1]]
                ,[cal.translation[2]]];

            cal.fx = cal.camera_intrinsic[0][0];
            cal.skew = cal.camera_intrinsic[0][1];
            cal.cx = cal.camera_intrinsic[0][2];
            cal.cy = cal.camera_intrinsic[1][2];
            cal.fy = cal.camera_intrinsic[1][1];

            log.info(cal, "_ren.fn.convertCalibrationValues, " + _ren.constants.CAL_TYPE_NAVERLABS_2025_01);
        } else {
            if (!_ren.constants.isCalError) {
                _ren.constants.isCalError = true;
                log.error(calibrationTxt, "_ren.fn.convertCalibrationValues, calibration contents is wrong.");
            }
        }
    } catch(E) {
        log.error(E, "_ren.fn.convertCalibrationValues");
    }
    _ren.data.cal = cal;
    //log.info(lines, "_ren.fn.convertCalibrationValues, lines");
    //log.info(cal, "_ren.fn.convertCalibrationValues, return");
    return cal;
}
_ren.fn.convertCal42dotExtrinsic = function(cal) {
    return ;
}
_ren.fn.convertCal42dotCamera = function(lines, startLineIndex) {
    const keys = ["x: ", "y: ", "z: ", "roll: ", "pitch: ", "yaw: ", "width: ", "height: ", "cx: ", "cy: ", "fx: ", "fy: ", "distortion: "];
    let cal = {};
    for(let i = startLineIndex; i < lines.length; i++) {
        for(let j = 0; j < keys.length; j++) {
            if(lines[i].startsWith(keys[j])) {
                let key = keys[j].replace(": ", "");
                cal[key] = lines[i].replace(keys[j], "");
                if(key == "distortion") {
                    cal[key] = JSON.parse(cal[key]);
                } else {
                    cal[key] = Number.parseFloat(cal[key]);
                }
                keys.splice(j, 1);
                break;
            }
        }
    }
    log.info(cal, "_ren.fn.convertCal42dotCamera");
    return cal;
}
_ren.fn.convertCal42dotLidar = function(lines, startLineIndex) {
    const keys = ["x: ", "y: ", "z: ", "roll: ", "pitch: ", "yaw: "];
    let cal = {};
    for(let i = startLineIndex; i < lines.length; i++) {
        for(let j = 0; j < keys.length; j++) {
            if(lines[i].startsWith(keys[j])) {
                let key = keys[j].replace(": ", "");
                cal[key] = lines[i].replace(keys[j], "");
                cal[key] = Number.parseFloat(cal[key]);
                keys.splice(j, 1);
                break;
            }
        }
    }
    log.info(cal, "_ren.fn.convertCal42dotLidar");
    return cal;
}

_ren.fn.getConvertCalibrationValues = function(calibrationTxt) {
    if(_ren.data.calibrationMap == null) {
        _ren.data.calibrationMap = new HashMap();
    }
    let mapData = _ren.data.calibrationMap.get(calibrationTxt);
    if(mapData == null) {
        mapData = _ren.fn.convertCalibrationValues(calibrationTxt);
        _ren.data.calibrationMap.put(calibrationTxt, mapData);
    }
    return mapData;
}

_ren.fn.getRgbaString = function(hex, opacity) {
    let rgb = _common.hexToRgb(hex);
    let rgba = "rgba(";
    rgba += rgb.r;
    rgba += ", ";
    rgba += rgb.g;
    rgba += ", ";
    rgba += rgb.b;
    rgba += ", ";
    rgba += opacity
    rgba += ")";
    return rgba;
}

_ren.fn.parseScientificNotation = function(scientificNotation) {
    // 문자열을 공백을 기준으로 분리하여 기수와 지수 부분을 얻습니다.
    const parts = scientificNotation.split('e');

    // 기수 부분을 부동 소수점 숫자로 파싱합니다.
    const significand = parseFloat(parts[0]);

    // 지수 부분을 정수로 파싱합니다.
    const exponent = parseInt(parts[1]);

    // 기수와 지수를 곱해서 최종 값을 계산합니다.
    return significand * Math.pow(10, exponent);
}

_ren.fn.covertDimArray = function(list, colSize) {
    const twoDimArray = [];
    for (let i = 0; i < list.length; i += colSize) {
        twoDimArray.push(list.slice(i, i + colSize));
    }
    return twoDimArray;
}
