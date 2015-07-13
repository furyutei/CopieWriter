(function(w, d) {

//{ ■パラメータ
var DEFAULT_CANVAS_SELECTOR = 'canvas#copie';
var DEFAULT_DOWNLOAD_COPIE_SELECTOR = 'a#download-copie';
var DEFAULT_DOWNLOAD_COPIE_BUTTON_SELECTOR = 'input#download-copie-button';
var DEFAULT_DOWNLOAD_COPIE_SETTING_SELECTOR = 'a#download-copie-setting';
var DEFAULT_DOWNLOAD_COPIE_SETTING_BUTTON_SELECTOR = 'input#download-copie-setting-button';
var DEFAULT_UPLOAD_COPIE_SETTING_SELECTOR = 'input#upload-copie-setting';
var DEFAULT_UPLOAD_COPIE_SETTING_BUTTON_SELECTOR = 'input#upload-copie-setting-button';
var DEFAULT_UPLOAD_COPIE_SETTING_FILE_SELECTOR = '#upload-copie-setting-file';
var DEFAULT_DROP_COPIE_SETTING_SELECTOR = 'body';
var DEFAULT_INITIAL_COPIE_SELECTOR = 'input#initial-copie';
var DEFAULT_INITIAL_COPIE_BUTTON_SELECTOR = 'input#initial-copie-button';
var DEFAULT_BACKGROUND_COLOR_SELECTOR = 'input#background-color';
var DEFAULT_RANDOM_COLOR_BUTTON_SELECTOR = 'input#random-color-button';
var DEFAULT_PHRASE_TEMPLATE_SELECTOR = 'div#phrase-template';
var DEFAULT_PHRASE_SELECTOR = 'section#phrase-container div.phrase:not(.hidden)';
var DEFAULT_PHRASE_CONTAINER_SELECTOR = 'section#phrase-container';
var DEFAULT_PHRASE_ADD_BUTTON_SELECTOR = 'input#phrase-add-button';

var DEFAULT_FONT_FAMILY = "'Hiragino Kaku Gothic Pro', 'Meiryo', 'MS PGothic', 'sans-serif'";
var DEFAULT_FONT_SIZE = 25;
var DEFAULT_COLOR = '#000000';
var DEFAULT_BACKGROUND_COLOR = '#FFFFFF';
var DEFAULT_BASELINE = 'middle';
var DEFAULT_ALIGN = 'left';
//}

var $ = w.$;

$(function() {

var CopieContext = makeClass(null, {
    __init__ : function(parameters) {
        var self = this;
        
        if (!parameters) {parameters = {};}
        
        var canvas_id = parameters.canvas_id;
        var phrase_selector = parameters.phrase_selector;
        var phrase_container_selector = parameters.phrase_container_selector;
        
        var width = parameters.width;
        var height = parameters.height;
        var color = parameters.color;
        var background_color = parameters.background_color;
        var default_font_family = parameters.default_font_family;
        var default_font_size = parameters.default_font_size;
        var baseline = parameters.baseline;
        var align = parameters.align;
        
        if (!canvas_id) {canvas_id = DEFAULT_CANVAS_SELECTOR;}
        if (!phrase_selector) {phrase_selector = DEFAULT_PHRASE_SELECTOR;}
        if (!phrase_container_selector) {phrase_container_selector = DEFAULT_PHRASE_CONTAINER_SELECTOR;}
        var jq_copie = $(canvas_id);
        var context = jq_copie.get(0).getContext('2d');

        self.jq_copie = jq_copie;
        self.phrase_selector = phrase_selector;
        self.phrase_container_selector = phrase_container_selector;
        self.context = context;
        
        if (!width) {width = jq_copie.width();}
        if (!height) {height = jq_copie.height();}
        if (!color) {color = DEFAULT_COLOR;}
        if (!background_color) {background_color = DEFAULT_BACKGROUND_COLOR;}
        if (!default_font_family) {default_font_family = DEFAULT_FONT_FAMILY;}
        if (!default_font_size) {default_font_size = DEFAULT_FONT_SIZE;}
        if (!baseline) {baseline = DEFAULT_BASELINE;}
        if (!align) {align = DEFAULT_ALIGN;}
        
        self.set_context({
            width : width
        ,   height : height
        ,   color : color
        ,   background_color : background_color
        ,   default_font_family : default_font_family
        ,   default_font_size : default_font_size
        ,   baseline : baseline
        ,   align : align
        });
        
    }   //  end of __init__()

,   get_context : function() {
        var self = this;
        
        return self.context;
    }   //  end of get_context()

,   get_context_setting : function() {
        var self = this;
        
        var setting = {
            width : self.width
        ,   height : self.height
        ,   background_color : self.background_color
        ,   default_font_family : self.default_font_family
        ,   default_font_size : self.default_font_size
        ,   baseline : self.baseline
        ,   align : self.align
        };
        return setting;
    }   //  end of get_context_setting()

,   set_context : function(parameters) {
        var self = this;
        
        if (!parameters) {parameters = {};}
        
        var width = parameters.width;
        var height = parameters.height;
        var color = parameters.color;
        var background_color = parameters.background_color;
        var default_font_family = parameters.default_font_family;
        var default_font_size = parameters.default_font_size;
        var baseline = parameters.baseline;
        var align = parameters.align;
        
        var jq_copie = self.jq_copie;
        
        context = self.get_context();
        if (width) {
            jq_copie.attr('width', width);
            self.width = width;
        }
        if (height) {
            jq_copie.attr('height', height);
            self.height = height;
        }
        if (color) {
            self.color = color;
        }
        if (background_color) {
            self.background_color = background_color;
        }
        if (default_font_family) {
            self.default_font_family = default_font_family;
        }
        if (default_font_size) {
            self.default_font_size = default_font_size;
        }
        if (baseline) {
            context.textBaseline = baseline;
            self.baseline = baseline;
        }
        if (align) {
            context.textAlign = align;
            self.align = align;
        }
        self.clear_context();
    }   //  end of set_context()
    
,   clear_context : function() {
        var self = this;
        var context = self.get_context();
        
        context.fillStyle = self.background_color;
        //context.clearRect(0, 0, self.width, self.height);
        context.fillRect(0, 0, self.width, self.height);
        
        if (30 <= getBrightness(self.background_color)) {
            context.fillStyle = '#000';
            context.strokeRect(0, 0, self.width, self.height);
        }
    }   //  end of clear_context()
    
,   get_phrase_values : function(jq_phrase) {
        var phrase_values = {
            text : jq_phrase.find('input[name="text"]').first().val()
        ,   x : jq_phrase.find('input[name="x"]').first().val()
        ,   y : jq_phrase.find('input[name="y"]').first().val()
        ,   size : jq_phrase.find('input[name="size"]').first().val()
        };
        return phrase_values;
    }   //  end of get_phrase_values()
    
,   put_phrase : function(jq_phrase) {
        var self = this;
        var context = self.get_context();
        var phrase_values = self.get_phrase_values(jq_phrase);
        
        var text = phrase_values.text;
        if (!text) return;
        
        var x = phrase_values.x;
        var y = phrase_values.y;
        var size = phrase_values.size;
        
        if (isNaN(x)) {x = 0;}
        if (isNaN(y)) {y = 0;}
        //if (isNaN(size) || size <= 0.0) {size = self.default_font_size;}
        if (isNaN(size) || size <= 0.0) {size = 1;}
        
        context.fillStyle = self.color;
        context.font = size + 'px ' + self.default_font_family;
        context.fillText(text, x, y);
        
    }   //  end of put_phrase()

,   get_phrase_container : function() {
        var self = this;
        
        return $(self.phrase_container_selector);
    }   //  end of get_phrase_container()

,   collect_phrases : function() {
        var self = this;
        
        return $(self.phrase_selector);
    }   //  end of collect_phrases()

,   update_context : function() {
        var self = this;
        
        self.clear_context();
        self.collect_phrases().each(function(){
            var jq_phrase = $(this);
            self.put_phrase(jq_phrase);
        });
    }   //  end of update_context()

,   get_current_phrase : function() {
        var self = this;
        
        var jq_phrases = self.collect_phrases();
        var jq_current_phrase = jq_phrases.filter('.current');
        if (0 < jq_current_phrase.size()) {
            jq_current_phrase = jq_current_phrase.first();
        }
        else if (0 < jq_phrases.size()) {
            jq_current_phrase = jq_phrases.last();
            jq_current_phrase.addClass('current');
        }
        else {
            jq_current_phrase = null;
        }
        return jq_current_phrase;
    }   //  end of get_current_phrase()

,   set_current_phrase : function(jq_phrase, focus) {
        var self = this;
        
        if (!jq_phrase) {
            return null;
        }
        self.collect_phrases().removeClass('current');
        jq_phrase.addClass('current');
        
        if (focus) {
            jq_phrase.find('input[name="text"]').first().focus();
        }
        
        return jq_phrase;
    }   //  end of set_current_phrase()

}); //  end of CopieContext()


var Phrase = makeClass(null, {
    __init__ : function(parameters) {
        var self = this;
        
        if (!parameters) {parameters = {};}
        
        var copie_context = parameters.copie_context;
        
        var text = parameters.text;
        var x = parameters.x;
        var y = parameters.y;
        var size = parameters.size;
        var refresh_copy = parameters.refresh_copy;
        var current = parameters.current;
        var insert_position = parameters.insert_position;
        
        var phrase_template_selector = parameters.phrase_template_selector;
        var phrase_container_selector = parameters.phrase_container_selector;
        
        if (!text) {text = '';}
        if (isNaN(x)) {x = 0;}
        if (isNaN(y)) {y = 0;}
        //if (!size) {size = DEFAULT_FONT_SIZE;}
        if (!size) {size = 1;}
        
        if (!phrase_template_selector) {phrase_template_selector = DEFAULT_PHRASE_TEMPLATE_SELECTOR;}
        if (!phrase_container_selector) {phrase_container_selector = DEFAULT_PHRASE_CONTAINER_SELECTOR;}
        
        self.copie_context = copie_context;
        var jq_phrase = $(phrase_template_selector).clone(true);
        self.jq_phrase = jq_phrase;
        self.jq_text = jq_phrase.find('input[name="text"]').first();
        self.jq_x = jq_phrase.find('input[name="x"]').first();
        self.jq_y = jq_phrase.find('input[name="y"]').first();
        self.jq_size = jq_phrase.find('input[name="size"]').first();
        
        jq_phrase.removeClass('hidden');
        jq_phrase.removeAttr('id');
        
        if (insert_position) {
            insert_position.after(jq_phrase);
        }
        else {
            $(phrase_container_selector).append(jq_phrase);
        }
        self.set_phrase_focus_event();
        self.set_phrase_change_event();
        self.set_phrase_delete_event();
        
        self.update_phrase({
            text : text
        ,   x : x
        ,   y : y
        ,   size: size
        ,   refresh_copy : refresh_copy
        ,   current : current
        });
        
    }   //  end of __init__()

,   set_phrase_focus_event : function() {
        var self = this;
        
        var jq_phrase = self.jq_phrase;
        
        jq_phrase.on('click focus', function(event) {
            event.preventDefault();
            event.stopPropagation();
            self.copie_context.set_current_phrase(jq_phrase);
            $('body,html').animate({scrollTop: jq_phrase.offset().top - $('header').height() - 8}, 'fast');
        });
        
    }   //  end of set_phrase_focus_event()

,   set_phrase_change_event : function() {
        var self = this;
        
        var jq_phrase = self.jq_phrase;
        
        jq_phrase.find('input').change(function(){
            self.update_phrase({
                refresh_copy : true
            });
        });
    }   //  end of set_phrase_change_event()

,   set_phrase_delete_event : function() {
        var self = this;
        
        var copie_context = self.copie_context;
        var jq_phrase = self.jq_phrase;
        
        jq_phrase.find('input[name="delete"]').first().on('click', function(event) {
            var jq_next_phrase = jq_phrase.next();
            if (!jq_next_phrase || jq_next_phrase.size() <= 0) {
                jq_next_phrase = copie_context.get_current_phrase();
            }
            if (jq_next_phrase && 0 < jq_next_phrase.size()) {
                copie_context.set_current_phrase(jq_next_phrase);
            }
            jq_phrase.remove();
            copie_context.update_context();
        });
    }   //  end of set_phrase_delete_event()

,   update_phrase : function(parameters) {
        var self = this;
        
        var jq_phrase = self.jq_phrase;
        
        if (!parameters) {parameters = {};}
        
        var text = parameters.text;
        var x = parameters.x;
        var y = parameters.y;
        var size = parameters.size;
        var refresh_copy = parameters.refresh_copy;
        var current = parameters.current;

        if (typeof text == 'string') {
            self.jq_text.val(text);
        }
        if (!isNaN(x)) {
            self.jq_x.val(x);
        }
        if (!isNaN(y)) {
            self.jq_y.val(y);
        }
        if (!isNaN(size) && 0 < size) {
            self.jq_size.val(size);
        }
        if (isNaN(self.jq_x.val())) {
            self.jq_x.val(0);
        }
        if (isNaN(self.jq_y.val())) {
            self.jq_y.val(0);
        }
        if (isNaN(self.jq_size.val())) {
            //self.jq_size.val(DEFAULT_FONT_SIZE);
            self.jq_size.val(1);
        }
        if (self.jq_size.val() <= 0) {
            //self.jq_size.val(1);
            self.jq_size.val('');
        }
        
        if (current) {
            self.copie_context.set_current_phrase(jq_phrase, true);
        }
        if (refresh_copy) {
            self.copie_context.update_context();
        }
    }   //  end of update_phrase()
    
}); // end of Phrase()


var CopieWriter = makeClass(null, {
    __init__ : function(parameters) {
        var self = this;
        
        if (!parameters) parameters = {};
        
        var canvas_selector = parameters.canvas_selector;
        var download_copie_selector = parameters.download_copie_selector;
        var download_copie_button_selector = parameters.download_copie_button_selector;
        var download_copie_setting_selector = parameters.download_copie_setting_selector;
        var download_copie_setting_button_selector = parameters.download_copie_setting_button_selector;
        var upload_copie_setting_selector = parameters.upload_copie_setting_selector;
        var upload_copie_setting_button_selector = parameters.upload_copie_setting_button_selector;
        var upload_copie_setting_file_selector = parameters.upload_copie_setting_file_selector;
        var drop_copie_setting_selector = parameters.drop_copie_setting_selector;
        var initial_copie_selector = parameters.initial_copie_selector;
        var initial_copie_button_selector = parameters.initial_copie_button_selector;
        var background_color_selector = parameters.background_color_selector;
        var random_color_button_selector = parameters.random_color_button_selector;
        var phrase_add_button_selector = parameters.phrase_add_button_selector;
        
        var url_copie_setting = parameters.url_copie_setting;
        var reverse_y_direction = parameters.reverse_y_direction;
        
        if (!canvas_selector) {canvas_selector = DEFAULT_CANVAS_SELECTOR;}
        if (!download_copie_selector) {download_copie_selector = DEFAULT_DOWNLOAD_COPIE_SELECTOR;}
        if (!download_copie_button_selector) {download_copie_button_selector = DEFAULT_DOWNLOAD_COPIE_BUTTON_SELECTOR;}
        if (!download_copie_setting_selector) {download_copie_setting_selector = DEFAULT_DOWNLOAD_COPIE_SETTING_SELECTOR;}
        if (!download_copie_setting_button_selector) {download_copie_setting_button_selector = DEFAULT_DOWNLOAD_COPIE_SETTING_BUTTON_SELECTOR;}
        if (!upload_copie_setting_selector) {upload_copie_setting_selector = DEFAULT_UPLOAD_COPIE_SETTING_SELECTOR;}
        if (!upload_copie_setting_button_selector) {upload_copie_setting_button_selector = DEFAULT_UPLOAD_COPIE_SETTING_BUTTON_SELECTOR;}
        if (!upload_copie_setting_file_selector) {upload_copie_setting_file_selector = DEFAULT_UPLOAD_COPIE_SETTING_FILE_SELECTOR;}
        if (!drop_copie_setting_selector) {drop_copie_setting_selector = DEFAULT_DROP_COPIE_SETTING_SELECTOR;}
        if (!initial_copie_selector) {initial_copie_selector = DEFAULT_INITIAL_COPIE_SELECTOR;}
        if (!initial_copie_button_selector) {initial_copie_button_selector = DEFAULT_INITIAL_COPIE_BUTTON_SELECTOR;}
        if (!background_color_selector) {background_color_selector = DEFAULT_BACKGROUND_COLOR_SELECTOR;}
        if (!random_color_button_selector) {random_color_button_selector = DEFAULT_RANDOM_COLOR_BUTTON_SELECTOR;}
        if (!phrase_add_button_selector) {phrase_add_button_selector = DEFAULT_PHRASE_ADD_BUTTON_SELECTOR;}
        
        if (!reverse_y_direction) {reverse_y_direction = false};
        
        var jq_copie = $(canvas_selector);
        var jq_download_copie = $(download_copie_selector);
        var jq_download_copie_button = $(download_copie_button_selector);
        var jq_download_copie_setting = $(download_copie_setting_selector);
        var jq_download_copie_setting_button = $(download_copie_setting_button_selector);
        var jq_upload_copie_setting = $(upload_copie_setting_selector);
        var jq_upload_copie_setting_button = $(upload_copie_setting_button_selector);
        var jq_upload_copie_setting_file = $(upload_copie_setting_file_selector);
        var jq_drop_copie_setting = $(drop_copie_setting_selector);
        var jq_initial_copie = $(initial_copie_selector);
        var jq_initial_copie_button = $(initial_copie_button_selector);
        var jq_background_color = $(background_color_selector);
        var jq_random_color_button = $(random_color_button_selector);
        var jq_phrase_add_button = $(phrase_add_button_selector);
        
        self.jq_copie = jq_copie;
        self.jq_download_copie = jq_download_copie;
        self.jq_download_copie_button = jq_download_copie_button;
        self.jq_download_copie_setting = jq_download_copie_setting;
        self.jq_download_copie_setting_button = jq_download_copie_setting_button;
        self.jq_upload_copie_setting = jq_upload_copie_setting;
        self.jq_upload_copie_setting_button = jq_upload_copie_setting_button;
        self.jq_upload_copie_setting_file = jq_upload_copie_setting_file;
        self.jq_drop_copie_setting = jq_drop_copie_setting;
        self.jq_initial_copie = jq_initial_copie;
        self.jq_initial_copie_button = jq_initial_copie_button;
        self.jq_background_color = jq_background_color;
        self.jq_random_color_button = jq_random_color_button;
        self.jq_phrase_add_button = jq_phrase_add_button;
        
        self.url_copie_setting = url_copie_setting;
        self.reverse_y_direction = reverse_y_direction;
        
        var parameters = {};
        $.extend(
            parameters
        ,   self.get_color_info()
        );
        var copie_context = CopieContext(parameters);
        self.copie_context = copie_context;
        
        self.sel_pageunload_event();
        self.set_wheel_event();
        self.set_key_event();
        self.set_download_event();
        self.set_upload_setting_event();
        self.set_download_setting_event();
        self.set_color_picker_event();
        self.set_initial_copie_event();
        self.set_random_color_event();
        self.set_phrase_add_event();
        self.set_copie_click_event();
        
        if (url_copie_setting) {
            $.get(url_copie_setting, function(setting) {
                self.update_copie_setting(setting);
                self.update_setting_filename(url_copie_setting.replace(/^.*?([^/]+)$/, '$1'));
                self.update_copie_data_url();
                self.update_setting_data_url();
            }, 'json');
        }
        else {
            Phrase({
                copie_context: copie_context
            ,   x : 8
            ,   y : 16
            ,   size : copie_context.default_font_size
            ,   refresh_copy : true
            ,   current : true
            });
            self.update_copie_data_url();
            self.update_setting_data_url();
        }
    }   //  end of __init__()
    
,   sel_pageunload_event : function() {
        var self = this;
        
        $(w).on('beforeunload', function(event) {
            if (self.jq_download_copie.attr('href') != self.jq_copie.get(0).toDataURL('image/png')) {
                return '編集中のコピィを破棄して、ページを移動しますか？';
            };
        });
    }   //  end of sel_pageunload_event()

,   set_wheel_event : function() {
        var self = this;
        
        $(d).on(('onwheel' in document) ? 'wheel' : ( ('onmousewheel' in document) ? 'mousewheel' : 'DOMMouseScroll'), function(event){
            var target = event.target, jq_target = $(target);
            if (target.tagName.toUpperCase() != 'INPUT' || jq_target.parents('.phrase').size() <= 0) return;
            
            if (target.name != 'x' && target.name != 'y' && target.name != 'size') return;
            
            var originalEvent = event.originalEvent;
            var delta = (originalEvent.deltaY) ? -(originalEvent.deltaY) : ( (originalEvent.wheelDelta) ? originalEvent.wheelDelta :  -(originalEvent.detail) );
            var direction = (0 < delta) ? 1 : -1;
            var multi = (event.shiftKey) ? 10 : 1;
            
            self.change_input_number(event, direction, multi);
            return false;
        });
    }   //  end of set_wheel_event()

,   set_key_event : function() {
        var self = this;
        
        $('html').keydown(function(event) {
            var target = event.target, jq_target = $(target);
            if (target.tagName.toUpperCase() != 'INPUT') return;
            
            var jq_phrase = jq_target.parents('.phrase');
            if (jq_phrase.size() <= 0) return;
            
            var copie_context = self.copie_context;
            copie_context.set_current_phrase(jq_phrase);
            
            var shiftKey = event.shiftKey, ctrlKey = event.ctrlKey;
            
            var multi = (shiftKey) ? 10 : 1;
            switch (event.which) {
                case 9: // [Tab]
                    if (!shiftKey && jq_target.attr('name') == 'delete') {
                        var jq_next_phrase = jq_phrase.next();
                    } 
                    else if (shiftKey && jq_target.attr('name') == 'text') {
                        var jq_next_phrase = jq_phrase.prev();
                    }
                    else {
                        break;
                    }
                    if (0 < jq_next_phrase.size()) {
                        copie_context.set_current_phrase(jq_next_phrase);
                        $('body,html').animate({scrollTop: jq_next_phrase.offset().top - $('header').height() - 8}, 'fast');
                    }
                    break;
                case 13: // [Enter]
                    if (ctrlKey) {
                        self.add_phrase();
                        return false;
                    }
                    setTimeout(function(){
                        jq_target.trigger('change', [true]);
                    }, 1);
                    break;
                case 38: // [↑]
                    if (target.name != 'x' && target.name != 'y' && target.name != 'size') return;
                    var direction = 1;
                    self.change_input_number(event, direction, multi);
                    return false;
                    break;
                case 40: // [↓]
                    if (target.name != 'x' && target.name != 'y' && target.name != 'size') return;
                    var direction = -1;
                    self.change_input_number(event, direction, multi);
                    return false;
                    break;
                case 46: // [Delete]
                    if (!ctrlKey) {
                        break;
                    }
                    var jq_next_phrase = jq_phrase.next();
                    jq_phrase.remove();
                    if (0 < jq_next_phrase.size()) {
                        copie_context.set_current_phrase(jq_next_phrase, true);
                    }
                    else {
                        copie_context.set_current_phrase(copie_context.collect_phrases().last(), true);
                    }
                    copie_context.update_context();
                    return false;
                    break;
                default:
                    setTimeout(function(){
                        jq_target.trigger('change', [true]);
                    }, 1);
                    break;
            };
        });
    }   //  end of set_key_event()

,   set_download_event : function() {
        var self = this;
        
        self.jq_download_copie_button.on('click', function(event) {
            self.update_copie_data_url();
            if (w.navigator.msSaveOrOpenBlob) { // IE10+
                w.navigator.msSaveOrOpenBlob(self.jq_copie.get(0).msToBlob(), self.jq_download_copie.attr('download'));
                return false;
            }
            else {
                self.mouse_click(self.jq_download_copie);
            }
        });
        
    }   //  end of set_download_event()

,   set_upload_setting_event : function() {
        var self = this;
        
        self.jq_drop_copie_setting.on('dragover', function(event) {
            event.preventDefault();
            event.stopPropagation();
        }).on('drop', function(event) {
            event.preventDefault();
            event.stopPropagation();
            self.read_copie_setting_file(event);
        });
        
        self.jq_upload_copie_setting.on('change', function(event) {
            self.read_copie_setting_file(event);
        });
        
        self.jq_upload_copie_setting_button.on('click', function(event) {
            self.jq_upload_copie_setting.click();
        });
        
    }   //  end of set_upload_setting_event()

,   set_download_setting_event : function() {
        var self = this;
        
        self.jq_download_copie_setting_button.on('click', function(event) {
            var blob = self.update_setting_data_url();
            if (w.navigator.msSaveOrOpenBlob) { // IE10+
                w.navigator.msSaveOrOpenBlob(blob, self.jq_download_copie_setting.attr('download'));
                return false;
            }
            else {
                self.mouse_click(self.jq_download_copie_setting);
            }
        });
        
    }   //  end of set_download_event()

,   set_color_picker_event : function() {
        var self = this;
        
        var jq_background_color = self.jq_background_color;
        
        jq_background_color.on('change', function(event){
            self.update_copie_setting();
        });
        
        jq_background_color.ColorPicker({
            livePreview : true
        ,   onSubmit: function(hsb, hex, rgb, el) {
                self.update_copie_setting({
                    background_color : hex
                });
                jq_background_color.ColorPickerHide();
            }
        ,   onChange: function (hsb, hex, rgb) {
                self.update_copie_setting({
                    background_color : hex
                });
            }
        ,   onBeforeShow: function () {
                jq_background_color.ColorPickerSetColor(jq_background_color.val());
            }
        });
    }   //  end of set_color_picker_event()

,   set_initial_copie_event : function() {
        var self = this;
        
        self.jq_initial_copie_button.on('click', function(event) {
            var phrases = self.get_random_phrases(self.jq_initial_copie.val());
            self.update_copie_setting({
                background_color : self.get_random_color_code()
            ,   phrases : phrases
            });
        })
        
        self.jq_initial_copie_button.parents('form').on('submit', function(){
            self.jq_initial_copie_button.click();
            return false;
        });
    }   //  end of set_initial_copie_event()

,   set_random_color_event : function() {
        var self = this;
        
        self.jq_random_color_button.on('click', function(event) {
            self.update_copie_setting({
                background_color : self.get_random_color_code()
            });
        });
        
        self.jq_random_color_button.parents('form').on('submit', function(){
            //self.jq_random_color_button.click();
            self.update_copie_setting();
            return false;
        });
    }   //  end of set_random_color_event()

,   set_phrase_add_event : function() {
        var self = this;
        
        self.jq_phrase_add_button.on('click', function(event) {
            self.add_phrase();
        });
        
    }   //  end of set_phrase_add_event()

,   set_copie_click_event : function() {
        var self = this;
        
        var copie_context = self.copie_context;
        
        copie_context.jq_copie.on('click', function(event) {
            var jq_phrase = copie_context.get_current_phrase();
            if (!jq_phrase) {
                return;
            }
            jq_phrase.find('input[name="x"]').first().val(event.offsetX);
            jq_phrase.find('input[name="y"]').first().val(event.offsetY);
            copie_context.update_context();
        });
        
    }   //  end of set_phrase_add_event()

,   mouse_click : function(jq_object) {
        // ※ jQuery の click() や trigger('click') だとうまく行かないことがある(data URI が設定された A 要素等)
        //jq_object.click();
        //jq_object.trigger('click', [true]);
        
        // マウスイベントや DOM 要素の click() ならうまく行く
        //var mouse_event = document.createEvent('MouseEvent'); mouse_event.initEvent("click", true, true); jq_object.get(0).dispatchEvent(mouse_event);
        jq_object.get(0).click();
    }   //  end of mouse_click()

,   add_phrase : function() {
        var self = this;
        
        var copie_context = self.copie_context;
        
        var jq_current_phrase = copie_context.get_current_phrase();
        var parameters = {
            copie_context: copie_context
        ,   refresh_copy : true
        ,   current : true
        ,   insert_position : jq_current_phrase
        };
        if (jq_current_phrase) {
            phrase_values = copie_context.get_phrase_values(jq_current_phrase);
            $.extend(parameters, phrase_values);
        }
        var phrase = Phrase(parameters);
    }   //  end of add_phrase()
    
,   change_input_number : function(event, direction, multi) {
        var self = this;
        
        var target = event.target, jq_target = $(target);
        if (self.reverse_y_direction && target.name == 'y') {
            direction *= -1;
        }
        var delta = direction * multi;
        
        event.preventDefault();
        event.stopPropagation();
        
        var value = parseInt(jq_target.val());
        switch (target.name) {
            case 'x':
            case 'y':
                if (isNaN(value)) {value = 0;}
                jq_target.val(value + delta);
                break;
            case 'size':
                if (isNaN(value)) {value = DEFAULT_FONT_SIZE;}
                jq_target.val((0 < value + delta) ? value + delta : 1);
                break;
        }
        jq_target.trigger('change', [true]);
        
    }   //  end of change_input_number()

,   update_copie_data_url : function() {
        var self = this;
        
        self.jq_download_copie.attr('href', self.jq_copie.get(0).toDataURL('image/png'));
    }   //  end of update_copie_data_url()

,   update_setting_data_url : function() {
        var self = this;
        
        var setting_json = JSON.stringify(self.get_setting());
        var URL = w.URL || w.webkitURL;
        var blob = new Blob([setting_json], {'type':'text/plain'});
        self.jq_download_copie_setting.attr('href', URL.createObjectURL(blob));
        
        return blob;
    }   //  end of update_setting_data_url()

,   update_setting_filename : function(filename) {
        var self = this;
        
        self.jq_upload_copie_setting_file.text(filename);
    }   //  end of update_setting_filename()

,   read_copie_setting_file : function(event) {
        var self = this;
        
        try {event.dataTransfer = event.originalEvent.dataTransfer;} catch (error) {}
        var file = (event.dataTransfer || event.target).files[0];
        
        var reader = new FileReader();
        reader.onloadend = function() {
            var setting_json = reader.result;
            try {
                var setting = JSON.parse(setting_json);
                self.set_setting(setting);
                self.update_setting_filename(file.name);
                self.update_copie_data_url();
                self.update_setting_data_url();
            }
            catch (error) {
                alert(error);
            }
        };
        reader.readAsText(file);
    }   //  end of read_copie_setting_file()

,   set_setting : function(setting) {
        var self = this;
        
        self.update_copie_setting(setting);
    }   //  end of set_setting()

,   get_setting : function() {
        var self = this;
        
        var copie_context = self.copie_context;
        
        var setting = copie_context.get_context_setting();
        
        var phrases = [];
        copie_context.collect_phrases().each(function(){
            var jq_phrase = $(this);
            phrases.push(copie_context.get_phrase_values(jq_phrase));
        });
        
        setting.phrases = phrases;
        
        return setting;
    }   //  end of get_setting()

,   get_color_info : function() {
        var self = this;
        
        var background_color = self.jq_background_color.val();
        if (!background_color.match(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)) {
            background_color = DEFAULT_BACKGROUND_COLOR;
            self.jq_background_color.val(DEFAULT_BACKGROUND_COLOR);
        }
        var color = (getBrightness(background_color) < 50) ? '#ffffff' : '#000000';
        
        return {
            color : color
        ,   background_color : background_color
        };
    }   //  end of get_color_info()

,   get_random_phrases : function(copie_text) {
        //  参考： http://copie.hatelabo.jp/.shared.js:c634a1a:/js/jquery-1.3.2.min.js,/js/jsdeferred.jquery.js,/js/jsenumerator.mini.js,/js/site-script.js,/js/HatenaStarMini.js
        
        var self = this;
        
        var copie_context = self.copie_context;
        
        var phrases = [], text_list = [];
        
        copie_text.replace(/(?:[「『(（]*).(?:[。、」』)）]*)/g, function (phrase_text) {
            text_list.push(phrase_text);
            return phrase_text;
        });
        text_list = text_list.slice(0, 100); // ※フレーズ数の制限
        
        var flicker = function(middle, range, adjust) {
            if (!adjust) {adjust = 0;}
            return Math.floor(middle + (Math.random() * range - (range / 2)) + adjust);
        };
        
        var width = copie_context.width, height = copie_context.height;
        var align = copie_context.align, baseline = copie_context.baseline;
        var base_x  = width / copie_text.length;
        
        var dx = 0;
        
        for (var ci=0, len = text_list.length; ci < len; ci++) {
            var text = text_list[ci], length = text.length;
            var x, y, size = flicker(base_x, base_x / 5);
            var adjust_x, adjust_y;
            
            switch (align) {
                case    'center' :
                    adjust_x = size * length / 2;
                    break
                case    'right' :
                    adjust_x = size * length;
                    break;
                case    'left' :
                default:
                    adjust_x = 0;
                    break
            }
            
            switch (baseline) {
                case    'top' :
                    adjust_y = -(size / 2);
                    break;
                case    'bottom':
                    adjust_y = size;
                    break;
                case    'middle':
                default:
                    adjust_y = 0;
                    break;
            }
            x = flicker(base_x * dx, base_x / 3, adjust_x);
            y = flicker(height / 2, 20, adjust_y);
            
            phrases.push({
                text : text
            ,   x : x
            ,   y : y
            ,   size : size
            })
            dx += length;
        }
        
        return phrases;
    }   //  end of get_random_phrases()

,   get_random_color_code : function() {
        return '#' + (0x1000000 | Math.floor(Math.random() * 0x1000000)).toString(16).slice(1);
    }   //  end of get_random_color_code()

,   update_copie_setting : function(setting) {
        var self = this;
        
        var copie_context = self.copie_context;
        
        if (!setting) {setting = {};}
        
        var background_color = setting.background_color;
        if (background_color) {
            if (!background_color.match(/^#/)) {
                background_color = '#' + background_color;
            }
            self.jq_background_color.val(background_color);
        }
        var parameters = {};
        
        $.extend(
            parameters
        ,   setting
        ,   self.get_color_info()
        );
        copie_context.set_context(parameters);

        var phrases = setting.phrases;
        if (phrases && 0 < phrases.length) {
            var jq_phrase_container = copie_context.get_phrase_container();
            jq_phrase_container.empty();
            
            for (var ci=0, len=phrases.length; ci < len; ci++) {
                var phrase = phrases[ci];
                Phrase({
                    copie_context: copie_context
                ,   text: phrase.text
                ,   x: phrase.x
                ,   y: phrase.y
                ,   size: phrase.size
                ,   refresh_copy : false
                });
            }
            copie_context.set_current_phrase(copie_context.collect_phrases().last(), true);
        }
        copie_context.update_context();
        
    }   //  end of update_copie_setting()

}); //  end of CopieWriter

// ===== 処理の開始

// オプション(設定ファイル)取得
var url_copie_setting = null;
if (w.location.href.match(/[?&]setting=([^&#]+)/)) {
    var url_copie_setting = decodeURIComponent(RegExp.$1);
}

CopieWriter({
    url_copie_setting : url_copie_setting
});

});

})(window, document);

// ■ end of file
