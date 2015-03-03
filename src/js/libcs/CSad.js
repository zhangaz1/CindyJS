var CSad = {};
CSad.sinsave = 'undefined';
CSad.cossave = 'undefined';

CSad.printArr = function(erg)
{
    var n = erg.value.length; 
    var ttemp=[];
    var ttempi=[];
    var printimag = false;
    for(var k=0; k < n; k++)
    {
        ttemp[k] = erg.value[k].value.real;
        ttempi[k] = erg.value[k].value.imag;
        if(ttempi[k] !== 0) printimag = true;
    }
        console.log(ttemp);
        if(printimag)
        console.log(ttempi);
};

CSad.zero = function(n){
    var erg = [];
    var zero = CSNumber.real(0);

    for(var i = 0; i < n.value.real; i++){
        erg[i] = zero;
    }

    return List.turnIntoCSList(erg);
};

CSad.number = function(x0, n){
    var erg = CSad.zero(n);
    erg.value[0] = x0;
    return erg;
};

CSad.variable = function(x0, n){
    var erg = CSad.zero(n);
    erg.value[0] = x0;
    erg.value[1] = CSNumber.real(1);
    return erg;
};

CSad.add = function(a, b){
    return List.add(a, b);
};

CSad.sub = function(a, b){
    return List.sub(a, b);
};

CSad.mult = function(f, g){
    if (f.value.length !== g.value.length){
        console.log("dims don't fit return nada");
        return nada;
    }

    var le = f.value.length;
    var erg = CSad.zero(CSNumber.real(le));

    var ges = CSNumber.real(0);
    for(var k = 0; k < le; k++){
        for(var i = 0; i <= k; i++){
           ges = CSNumber.add(ges,  CSNumber.mult(f.value[i], g.value[k-i]));
        } // end inner
        erg.value[k] = ges;
        ges = CSNumber.real(0);
    } // end outer

    return erg;
};


CSad.pow= function(a, b){
    if(b.value.real !== Math.floor(b.value.real)) console.log("only implemented intergers for pow!");
    var temp = a;

    for(var i = 1; i < b.value.real; i++)
    {
        temp = CSad.mult(temp, a);
    }
    
    return temp;
};

// f / g
CSad.div = function(f, g){
    if (f.value.length !== g.value.length)
        { 
            console.log("dims don't fit - return nada");
            return nada;
        }


    var zero = CSNumber.real(0);
    var le = f.value.length;
    var erg = CSad.zero(CSNumber.real(le));
    erg.value[0] = CSNumber.div(f.value[0], g.value[0]);

    var sum = zero;
    var ges = zero;
    for(var k = 0; k < le; k++){
        ges = f.value[k];
        for(var i = 0; i < k; i++){
           sum = CSNumber.add(sum,  CSNumber.mult(erg.value[i], g.value[k-i] ));
        } // end inner

        ges = CSNumber.sub(ges, sum);
        ges = CSNumber.div2(ges, g.value[0]); // TODO L'Hospital!
        erg.value[k] = ges;
        ges = zero;
        sum = zero;
    } // end outer

    return erg;
};

CSad.exp = function(f){
//    console.log("f in exp", f);
    var zero = CSNumber.real(0);
    var le = f.value.length;
    var erg = CSad.zero(CSNumber.real(le));
    //var fac = CSad.faculty(CSNumber.real(le));

    var sum = zero;
    var inner;
    erg.value[0] = CSNumber.exp(f.value[0]);
//    console.log("CSNumber exp");
//    console.log(CSNumber.exp(f.value[0]));
    for(var k = 1; k < le; k++){
        for(var i = 1; i <= k; i++){
            inner = CSNumber.mult(CSNumber.real(i), f.value[i]);
            inner = CSNumber.mult(inner, erg.value[k-i]);
            //console.log("erg value", erg.value[k-i].value.real);
            //CSad.printArr(erg);
            sum = CSNumber.add(sum, inner);
            //console.log("sum, k", sum.value.real, k);
        } // end inner
        erg.value[k] = CSNumber.div(sum, CSNumber.real(k));
//        erg.value[k] = CSNumber.div(sum, fac.value[k]);
        sum = zero;
    } // end outer

    return erg;
};

CSad.log = function(f){
    var zero = CSNumber.real(0);
    var le = f.value.length;
    var erg = CSad.zero(CSNumber.real(le));
    erg.value[0] = CSNumber.log(f.value[0]);

    var sum = zero;
    var ges;
    var inner;
    for(var k = 1; k < le; k++){
        ges = f.value[k];
        for(var i = 1; i < k; i++){
           inner = CSNumber.mult(CSNumber.real(i), erg.value[i])
           inner = CSNumber.mult(inner, f.value[k-i]);
           sum = CSNumber.add(sum, inner);
        } // end inner

        sum = CSNumber.div(sum, CSNumber.real(k));
        ges = CSNumber.sub(ges, sum);
        ges = CSNumber.div(ges, f.value[0]);
        erg.value[k] = ges;
        sum = zero;
    } // end outer

    return erg;
};

CSad.sincos = function(f){
    //console.log("f");
    //CSad.printArr(f);
    var zero = CSNumber.real(0);
    var le = f.value.length;
    var ergsin = CSad.zero(CSNumber.real(le));
    var ergcos = CSad.zero(CSNumber.real(le));
    ergsin.value[0] = CSNumber.sin(f.value[0]);
    ergcos.value[0] = CSNumber.cos(f.value[0]);

    var sumcos = zero;
    var sumsin = zero;
    var insin, incos, inboth;
    var numk;
    for(var k = 1; k < le; k++){
           numk = CSNumber.real(k); 
        for(var i = 1; i <= k; i++){
           inboth = CSNumber.mult(CSNumber.real(i), f.value[i]);
         //  console.log("inboth", inboth.value.real);
         //  console.log("cos k-i", ergcos.value[k-i].value.real);
         //  console.log("sin k-i", ergsin.value[k-i].value.real);
           insin = CSNumber.mult(inboth, ergcos.value[k-i]);
           incos = CSNumber.mult(inboth, ergsin.value[k-i]);

           sumsin = CSNumber.add(sumsin, insin);

           sumcos = CSNumber.add(sumcos, incos);
        } // end inner

          // console.log("sumsin", sumsin.value.real);
         //  console.log("sumcos", sumcos.value.real);
           sumsin = CSNumber.div(sumsin, numk);
           sumcos = CSNumber.div(sumcos, CSNumber.neg(numk));
           ergsin.value[k] = sumsin;
           ergcos.value[k] = sumcos;
           sumsin = zero;
           sumcos = zero;
    } // end outer

    //CSad.printArr(ergsin);
    //CSad.printArr(ergcos);

    CSad.sinsave = ergsin;
    CSad.cossave = ergcos;
    return [ergsin, ergcos];

};

CSad.sin = function(f){
//    if(CSad.sinsave !== 'undefined') return CSad.sinsave;
    var erg = CSad.sincos(f);
    CSad.sinsave = erg[0];
    CSad.cossave = erg[1];
    return erg[0];
};

CSad.cos = function(f){
//    if(CSad.cossave !== 'undefined') return CSad.cossave;
    var erg = CSad.sincos(f);
    CSad.sinsave = erg[0];
    CSad.cossave = erg[1];
    return erg[1];
};


CSad.faculty = function(n){
    var erg = [];
    erg[0] = CSNumber.real(1);
    var val = 1;
        for(var i = 1; i <= n.value.real; i++){
            val = i*val;
            erg[i] = CSNumber.real(val);
        }
    erg = List.turnIntoCSList(erg);
    return erg;
};



CSad.diff = function(prog, x0, grade){
    var erg;

    if(prog.ctype == "variable"){
      erg = CSad.variable(x0, grade);
    }
    else if(prog.ctype == "number"){
      erg = CSad.number(prog, grade);
    }

    else if(prog.ctype == "infix"){
        if(prog.oper == "*"){
            return CSad.mult(CSad.diff(prog.args[0], x0, grade), CSad.diff(prog.args[1], x0, grade));
        }
        if(prog.oper == "^"){
            return CSad.pow(CSad.diff(prog.args[0], x0, grade), prog.args[1]);
        }

        if(prog.oper == "/"){
            return CSad.div(CSad.diff(prog.args[0], x0, grade), CSad.diff(prog.args[1], x0, grade));
        }
        else if(prog.oper == "+"){
           return CSad.add(CSad.diff(prog.args[0], x0, grade), CSad.diff(prog.args[1], x0, grade));
        }
        else if(prog.oper == "-"){
           return CSad.sub(CSad.diff(prog.args[0], x0, grade), CSad.diff(prog.args[1], x0, grade));
        }

        else{
            console.log("infix not found", prog.oper);
            return nada;
        }

    }
    else if(prog.ctype == "function"){
        if(prog.oper == "exp$1"){
            return CSad.exp(CSad.diff(prog.args[0], x0, grade));
        }
        if(prog.oper == "log$1"){
            return CSad.log(CSad.diff(prog.args[0], x0, grade));
        }
        if(prog.oper == "sin$1"){
            return CSad.sin(CSad.diff(prog.args[0], x0, grade));
        }
        if(prog.oper == "cos$1"){
            return CSad.cos(CSad.diff(prog.args[0], x0, grade));
        }
    }
    else{
        console.log("ctype not found", prog.ctype);
        return nada;
    }

    return erg;

};

CSad.adevaluate = function(ffunc, x0, grade){
//    console.log("ffunc, x0, grade", ffunc, x0, grade);
    var code = condense(ffunc.value);
    var prog = analyse(code);

    var ergarr = CSad.diff(prog, x0, grade);
    //console.log("erg before fac");
    //console.log(ergarr);
   //CSad.printArr(ergarr);
    var facs = CSad.faculty(grade);
    for(var i = 2; i < grade.value.real; i++){
        ergarr.value[i] = CSNumber.mult(ergarr.value[i], facs.value[i]);
    }

    //console.log("erg after fac");
    //CSad.printArr(ergarr);

    return ergarr;
};

CSad.autodiff = function(ffunc, xarr, grade){
    var erg = [];
    var le = xarr.value.length;

    var arr;
    for(var i = 0; i < le; i++){
        arr = CSad.adevaluate(ffunc, xarr.value[i], grade);
        erg[i] = arr;
    }

   // for(var i = 0; i < le; i++){
   //    CSad.printArr(erg[i]);
   // }


    erg = List.turnIntoCSList(erg);
    return erg;
};
