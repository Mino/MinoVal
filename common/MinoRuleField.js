if((typeof require) === 'function'){
    extend = require('extend');
    FVRule = require('minodb').FVRule;
    FVRuleField = require('minodb').FVRule.FVRuleField;
    FieldVal = require("fieldval");
    BasicVal = FieldVal.BasicVal;
}

if (typeof extend !== 'undefined') {
	extend(MinoRuleField, FVRuleField);
} else {
	fieldval_ui_extend(MinoRuleField, FVRuleField);
}

function MinoRuleField(json, validator) {
	var field = this;
	MinoRuleField.superConstructor.call(this, json, validator);
}

MinoRuleField.prototype.create_ui = function(use_form){
	var field = this;

	field.ui_field = new FVProxyField(field.display_name || field.name, {use_form:use_form});

	minoval.get_type_rule(field.minodb_field, function(err, vr) {
		var inner_field = vr.field.create_ui(parent);
		console.log(inner_field);
        field.ui_field.replace(inner_field);
	});


	field.element = field.ui_field.element;
	return field.ui_field;
};

MinoRuleField.prototype.init = function() {
	var field = this;

	field.minodb_field = field.validator.get("minodb_field", BasicVal.string(true));

	field.checks.push(function(value, emit, done) {
		minoval.get_type_rule(field.minodb_field, function(err, vr) {
			vr.validate(value, function(error) {
				done(error);
			});
		});

	});

	return field.validator.end();
};

MinoRuleField.add_editor_params = function(editor, value) {
	var field = this;
	minoval.get_types(function(err, types) {
        editor.add_field("minodb_field", new MinovalField("Mino field", {
			types: types
		}));
		editor.fields.minodb_field.val(value.minodb_field);
		if (editor.is_disabled) {
			editor.fields.minodb_field.disable();
		}
    });
};

if (typeof module != 'undefined') {
    module.exports.field = MinoRuleField;
    module.exports.init = function(local_minoval) {
    	minoval = local_minoval;
    };
}

FVRuleField.add_field_type({
    name: 'minodb_field',
    display_name: 'Mino field',
    class: MinoRuleField
});
