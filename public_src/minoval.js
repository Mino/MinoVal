function MinoVal() {
    var minoval = this;
    minoval.init_path();
}

MinoVal.prototype.init_path = function(name, callback) {
    var minoval = this;
    var scripts = document.getElementsByTagName("script");
    for (var i=0; i<scripts.length; i++) {
        var script = scripts[i];
        if (script.src.indexOf('/minoval.js') != -1) {
            minoval.path = script.src.replace('/minoval.js', '');
            break;
        }
    }
};

MinoVal.create_fv_rule_from_object = function(object, callback) {
    var vr = new FVRule();
    var rule_error = vr.init(object);
    if(rule_error){
        console.error(rule_error);
        callback(rule_error);
    } else {
        callback(null, vr);
    }
};

MinoVal.prototype.get_type_rule = function(name, callback) {
    var minoval = this;
    console.log("minoval.get_type_rule", name);
    $.post(minoval.path + '/get_type_rule', {name: name}, function(type_object) {
        console.log(type_object);
        if (type_object === null) {
            callback({
                error_message: "Rule doesn't exist"
            });
            return;
        }

        MinoVal.create_fv_rule_from_object(type_object, callback);
    });
};

MinoVal.prototype.get_rule = function(name, callback) {
    var minoval = this;
    console.log("minoval.get_rule", name);
    $.post(minoval.path + '/get_rule', {name: name}, function(type_object) {
        console.log(type_object);
        if (type_object === null) {
            callback({
                error_message: "Rule was not found"
            });
            return;
        } else if (type_object.error !== undefined) {
            callback(type_object);
            return;
        }

        MinoVal.create_fv_rule_from_object(type_object, callback);
        
    });
};

MinoVal.prototype.get_types = function(callback) {
    var minoval = this;
    
    $.post(minoval.path + '/get_types', function(res) {
        callback(null, res.types);
    });   
};

minoval = new MinoVal();

@import("../common/MinoRuleField.js");
@import("../common/MinovalField/MinovalField.js");
