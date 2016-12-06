$(function(){
	var audio=$("#luo").get(0)
	var hour=$("#hours").get(0)
	var canvas=$("#canvas").get(0)
	var white=$("#white").get(0)
	var black=$("#black").get(0)
	var right=$("#right").get(0)
	var left=$("#left").get(0)
	var start=$(".foot .start")
	var zanting=$(".foot .zanting")
	var ctx=canvas.getContext('2d')
	var ctx2=white.getContext('2d')
	var ctx3=black.getContext('2d')
	var ctx4=right.getContext('2d')
	var ctx5=left.getContext('2d')
	var deg1=0;
	var deg2=0;
	var sep=40;
	var sr=4;
	var lr=18;
	var drop={};
	var flag=true;
	var close=$(".can .box .close")
	var box=$(".can .box")
	var win=$(".win")
	var more=$("#link .more")
	var generate=$("#link .generate")
	var see=$(".foot .see")
	var restart=$(".foot .restart")
	var gameState="puse";
    var kongbai={};
    var AI=false;
	
	
	function lan(x){
		return (x+0.5)*sep+0.5
	}
	///////////////////////////////////////////////////////
	//绘制棋盘
	
	//绘制圆
	function circle(a,b,r){
		ctx.save()
		ctx.translate(lan(a),lan(b))
		ctx.beginPath()
		ctx.arc(0,0,r,0,Math.PI*2)
		ctx.closePath()
		ctx.fill()
		ctx.restore()
	}
	//绘制棋盘
	//棋盘格
	function qipan(){
		ctx.beginPath()
		ctx.strokeStyle= "#333333"
		for(var i=0;i<15;i++){
			ctx.moveTo(20.5,20.5+i*sep)
			ctx.lineTo(580.5,20.5+i*sep)
			ctx.moveTo(20.5+i*sep,20.5)
			ctx.lineTo(20.5+i*sep,580.5)
		}
		ctx.closePath()
		ctx.stroke()
		for(var i=0;i<15;i++){
            for(var j=0;j<15;j++){
                kongbai[m(i,j)]=true;
            }
      }
		//棋盘中的圆点
		circle(7,7,sr)
		circle(3,3,sr)
		circle(3,11,sr)
		circle(11,3,sr)
		circle(11,11,sr)
	}
	
	qipan()
	
	//绘制太极
	function drawTaiJi(context,x,y,r,color,deg){ //定义绘制太极图函数，参数为上下文id，x/y坐标,半径，颜色，角度；
        context.save();           //保存状态
        context.translate(x,y);   //设置画布旋转的中心点
        context.rotate(deg);
        context.translate(-x,-y); //
        context.shadowColor="rgba(10,10,10,0.5)"; //阴影颜色
        context.shadowOffsetX=context.shadowOffsetY=5;  //阴影方向
        context.shadowBlur=5;  //高斯值
        context.fillStyle=color;
        context.beginPath();
        context.arc(x,y,r,Math.PI*1.5,Math.PI*0.5);
        context.arc(x,y+r/2,r/2,Math.PI*0.5,Math.PI*1.5);
        context.arc(x,y-r/2,r/2,Math.PI*0.5,Math.PI*1.5,true);  //默认顺时针，值为false；逆时针为true；
        context.lineJoin="round";
        context.closePath();
        context.fill();
        context.shadowColor="rgba(10,10,10,0)";  //初始化阴影颜色
        context.restore();         //恢复状态；
    }
	
	function taiji(){
		drawTaiJi(ctx4,130,150,150,"#000",0); //绘制太极黑
		drawTaiJi(ctx5,200,150,150,"#fff",Math.PI); //绘制太极白
        luozi(ctx4,2.7,5.2,'white');      //绘制太极棋眼
        luozi(ctx5,4.7,1.2,'black');      //绘制太极棋眼
	}
	taiji()
	
	
	
	
	/////////////////////////////////////////
	//游戏运行
	//开始游戏
	function luozi(context,x,y,color){
		context.save()
		context.translate(lan(x),lan(y))
		context.beginPath()
		var radialgradient = context.createRadialGradient(0,0,lr,5,-5,0);
		if(color==='black'){
			radialgradient.addColorStop(0,"#0a0a0a");
            radialgradient.addColorStop(1,"#636363");
		}else{
		    radialgradient.addColorStop(0,"#e1e1e1");
            radialgradient.addColorStop(1,"#f1f1f1");
		}
		context.fillStyle = radialgradient;
		context.arc(0,0,lr,0,Math.PI*2)
		context.closePath()
		context.fill()
		context.restore()
		if(context===ctx){
			drop[x+'-'+y]=color
			gameState="play";
        	delete kongbai[m(x,y)];
		}
	}
	var t1;
	var t2;
	
	//  模式
    $(".battle").on("click",function(){
        if($(".battle").text()=="人机对战"){
            AI=false;
            if(gameState=="play"){
                $(".battle").off('click');
                return
            }else{
            	$(".battle").html("人人对战");
            }
                
            
        }else if($(".battle").text()=="人人对战"){
            AI=true;
            if(gameState=="play"){
                $(".battle").off('click');
                return
            }else{
            	$(".battle").html("人机对战");
            }
                
            
        }
    });
	can()
                
	//生成棋谱
	generate.on("click",function(){
		chessManual()
		box.addClass("clo")
		win.removeClass("wins")
	})
    
    $(".box .close").on("click",function(){
    	box.removeClass("clo")
    	for(var k in drop){
    		var x=parseInt(k.split('-')[0])
    		var y=parseInt(k.split('-')[1])
    		luozi(ctx,x,y,drop[k])
    	}
    })
    
    //重新开始
	restart.on("click",function(){
		hour.pause()
    	ctx.clearRect(0,0,600,600)
    	drop={}
    	qipan()
    	clearInterval(t1)
    	clearInterval(t2)
    	deg1=0
    	deg2=0
    	flag=true
    	can()
    	gameState="puse"
	})
	
	
	//再来一局
	$("#link .more").on("click",function(){
		win.removeClass("wins")
    	ctx.clearRect(0,0,600,600)
    	drop={}
    	qipan()
    	flag=true
    	can()
    	gameState="puse"
	})
	
	
	//查看棋谱
	see.on("click",function(){
		chessManual()
		box.addClass("clo")
	})
		
    
    ////////////////////////////////////////////////
    //落子函数
	function can(){
		$(canvas).on("click",false,function(e){
			var x=Math.floor(e.offsetX/sep)
			var y=Math.floor(e.offsetY/sep)
			hour.play()
			if(drop[x+'-'+y]){
				return
			}else{
				clearInterval(t2)
				clearInterval(t1)
				
				//人机
	            if(AI){
	                luozi(ctx,x,y,"black")
					audio.play()
					clearInterval(t2)
					t1=setInterval(render1,6/36*1000)
	                if(panduan(x,y,"black")>=5){
	                    $(canvas).off("click")
						clearInterval(t1)
						win.addClass("wins")
						$("#color").html("黑棋")
						deg1=0
						deg2=0
						hour.pause()
	                }
	                var p=intel();
	                luozi(ctx,p.x,p.y,"white");
	                audio.play()
	                clearInterval(t1)
	                t2=setInterval(render2,6/36*1000)
	                if(panduan(p.x,p.y,"white")>=5){
	                   $(canvas).off("click")
						clearInterval(t2)
						win.addClass("wins")
						$("#color").html("白棋")
						deg1=0
						deg2=0
						hour.pause()
	                }
	                return false;
	            }
				//人人
				if(flag){
					luozi(ctx,x,y,'black')
					audio.play()
					t1=setInterval(render1,6/36*1000)
					if(panduan(x,y,'black')>=5){
						$(canvas).off("click")
						clearInterval(t1)
						win.addClass("wins")
						$("#color").html("黑棋")
						deg1=0
						deg2=0
						hour.pause()
					}
					
				}else{
					luozi(ctx,x,y,'white')
					audio.play()
					t2=setInterval(render2,6/36*1000)
					if(panduan(x,y,'white')>=5){
						$(canvas).off("click")
						clearInterval(t2)
						win.addClass("wins")
						$("#color").html("白棋")
						deg1=0
						deg2=0
						hour.pause()
					}
				}
				flag=!flag
				
			}
		})	
	}
    
    
    //人机
     function intel(){
         var max=-Infinity;
         var pos={};
         for(var k in kongbai){
             var x=parseInt(k.split("-")[0]);
             var y=parseInt(k.split("-")[1]);
             var m=panduan(x,y,"black")
             if(m>max){
                 max=m;
                 pos={x:x,y:y};
             }
         }
         var max2=-Infinity;
         var pos2={};
         for(var k in kongbai){
             var x=parseInt(k.split("-")[0]);
             var y=parseInt(k.split("-")[1]);
             var m=panduan(x,y,"white")
             if(m>max2){
                 max2=m;
                 pos2={x:x,y:y};
             }
         }
         if(max>max2){
             return pos;
         }else{
             return pos2;
         }
         
     }
    
    
    
    
	////////////////////////////////////////////
	//秒表
	
	function render1(){
		ctx2.save();
		ctx2.clearRect(0,0,200,200);
		ctx2.translate(100,100)  
		zhen1();
//		pan1();
		ctx2.restore();
	}
	function render2(){
		ctx3.save();
		ctx3.clearRect(0,0,200,200);
		ctx3.translate(100,100)  
		zhen2();
//		pan2();
		ctx3.restore();
	}
	render1()
	render2()
	
	//表盘
	function pan1(){
		ctx2.beginPath()
		ctx2.arc(0,0,80,0,Math.PI*2)
		ctx2.closePath()
		ctx2.stroke()
		for (var i=0;i<60;i++){
			ctx2.save()
			ctx2.beginPath()
			ctx2.moveTo(0,-80)
			if(i===0){
				ctx2.lineTo(0,-70)
			}else{
				ctx2.lineTo(0,-75)
			}
			ctx2.restore()
			ctx2.closePath()
			ctx2.stroke()
			ctx2.rotate(Math.PI/180*6)
		}
	}
	function pan2(){
		ctx3.beginPath()
		ctx3.arc(0,0,80,0,Math.PI*2)
		ctx3.closePath()
		ctx3.stroke()
		for (var i=0;i<60;i++){
			ctx3.save()
			ctx3.beginPath()
			ctx3.moveTo(0,-80)
			if(i===0){
				ctx3.lineTo(0,-70)
			}else{
				ctx3.lineTo(0,-75)
			}
			ctx3.restore()
			ctx3.closePath()
			ctx3.stroke()
			ctx3.rotate(Math.PI/180*6)
		}
	}
	//表针
	function zhen1(){
		ctx2.save()
//		ctx2.strokeStyle="#c00"
		ctx2.lineWidth = 2;
		ctx2.beginPath()
		deg1 +=1
        if(deg1<=360){
        	ctx2.rotate(Math.PI/180*deg1)
        }
        ctx2.arc(0,0,5,0,Math.PI*2)
        ctx2.moveTo(0,5)
        ctx2.lineTo(0,20)
        ctx2.moveTo(0,-5)
        ctx2.lineTo(0,-60)
		ctx2.closePath()
        ctx2.stroke()
        ctx2.restore()
	}
	function zhen2(){
		ctx3.save()
//		ctx3.strokeStyle="#c00"
		ctx3.lineWidth = 2;
		ctx3.beginPath()
        deg2 +=1
        if(deg2<=360){
        	ctx3.rotate(Math.PI/180*deg2)
        }
		
        ctx3.arc(0,0,5,0,Math.PI*2)
        ctx3.moveTo(0,5)
        ctx3.lineTo(0,20)
        ctx3.moveTo(0,-5)
        ctx3.lineTo(0,-60)
		ctx3.closePath()
        ctx3.stroke()
        ctx3.restore()
	}
	
	
	//////////////////////////////////////////////////
	//判断输赢
	function m(a,b){
		return a+'-'+b
	}
	function panduan(x,y,color){
		var i;
		//行
		var row=1;
		i=1;while(drop[m(x+i,y)]=== color){row++; i++;}
		i=1;while(drop[m(x-i,y)]=== color){row++; i++;}
		//列
		var lie=1
		i=1;while(drop[m(x,y+i)]=== color){lie++; i++;}
		i=1;while(drop[m(x,y-i)]=== color){lie++; i++;}
		//左斜
		var le=1;
		i=1;while(drop[m(x+i,y+i)]=== color){le++; i++;}
		i=1;while(drop[m(x-i,y-i)]=== color){le++; i++;}
		//右斜
		var rig=1;
		i=1;while(drop[m(x+i,y-i)]=== color){rig++; i++;}
		i=1;while(drop[m(x-i,y+i)]=== color){rig++; i++;}
		
		return Math.max(row,lie,le,rig)
	}
	
	
	//////////////////////////////////////////////////////
	//棋谱 chessmanual
	
	function chessManual(){
		var i=1;
		ctx.save()
		ctx.font="18px/1,微软雅黑"
		ctx.textBaseline="middle"
		ctx.textAlign="center"
		for(var k in drop){
			var arr=k.split("-")
			if(drop[k]==='white'){
				ctx.fillStyle="black";
			}else{
				ctx.fillStyle="white"
			}
		ctx.fillText(i++,lan(parseInt(arr[0])),lan(parseInt(arr[1])))
		}
		ctx.restore()
		if(box.find("img").length){
			box.find("img").attr('src',canvas.toDataURL())
		}else{
			$("<img>").attr('src',canvas.toDataURL()).appendTo('.box')
		}
		
		$('<a>').attr('href',canvas.toDataURL()).attr('download','qipu.png').appendTo('.box')
	}
	
	
	
	
	
	
	
	
	
})
