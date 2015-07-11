// http://d.hatena.ne.jp/furyu-tei/20110619/1308476410

var makeClass = (function() {
    var origin_constructor=null;
    var name_to_class={};
    var change_toString=function(target,name) {
        var _toString=target.toString;
        target.toString=function() {
            return _toString.apply(this,arguments).replace(/\x28/,name+'\x28');
        };
    };
    var update_properties=function(obj_constructor,prop_assoc) {
        var _prototype=obj_constructor.prototype;
        for (var key in prop_assoc) {
            if (!prop_assoc.hasOwnProperty(key)) continue;
            _prototype[key]=prop_assoc[key];
        }
    };
    var makeClass=function(base,prop_assoc,name) {
        if (!prop_assoc) prop_assoc={};
        var obj_constructor=function() {};
        obj_constructor.__for_class__=true;
        var super_constructor=null;
        if (base) {
            switch (typeof base) {
                case    'string'    : if (name_to_class[base]) super_constructor=name_to_class[base].__constructor__; break;
                case    'function'  : super_constructor=(base.__constructor__)?base.__constructor__:base; break;
                case    'object'    : super_constructor=base.constructor; break;
            }
            if (super_constructor&&super_constructor.__for_class__) {
                try{
                    obj_constructor.prototype=new super_constructor();
                    obj_constructor.prototype.__super__=super_constructor;
                }
                catch (e) {
                    super_constructor=null;
                }
            }
        }
        if (!super_constructor&&origin_constructor) {
            obj_constructor.prototype=new origin_constructor();
            obj_constructor.prototype.__super__=origin_constructor;
        }
        update_properties(obj_constructor,prop_assoc);
        obj_constructor.prototype.constructor=obj_constructor;
        
        var __class__=function() {
            var self=new obj_constructor();
            self.__class__=__class__;
            if (typeof self.__init__=='function') self.__init__.apply(self,arguments);
            return self;
        };
        obj_constructor.__class__=__class__;
        __class__.__constructor__=obj_constructor;
        
        __class__.update_properties=function(prop_assoc) {
            update_properties(obj_constructor,prop_assoc);
        };
        
        if (typeof name=='string') {
            __class__.__name__=obj_constructor.__name__=name;
            change_toString(__class__,name);
            change_toString(obj_constructor,name);
            name_to_class[name]=__class__;
        }
        return __class__;
    };
    origin_constructor=makeClass(null,{},'Class').__constructor__;
    
    return makeClass;
})();   //  end of makeClass()

// ■ end of file
