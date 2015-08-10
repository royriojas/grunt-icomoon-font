{{
  var
    fontData = it.fontData || {}, 
    name = fontData.name,
    prefix = fontData.prefix;
}}

.{{=prefix}}props() {
  font-family: '{{= name }}';
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;

  // Better Font Rendering
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.{{=prefix}}code(@content, current) {
  content:@content;
}

.{{=prefix}}code(@content, before) {
  &:before {
    content:@content;
  }
}

.{{=prefix}}code(@content, after) {
  &:after {
    content:@content;
  }
}

.{{=prefix}}code-prop(@content, current) {
    .{{=prefix}}props();
  content:@content;
}

.{{=prefix}}code-prop(@content, before) {
  &:before {
    .{{=prefix}}props();
    content:@content;
  }
}

.{{=prefix}}code-prop(@content, after) {
  &:after {
    .{{=prefix}}props();
    content:@content;
  }
}

{{~ fontData.icons :icon:index }}
{{
  var
    iconName = icon.className,
    iconProp = '@'+ iconName + '-code',
    iconCode = icon.hexCode;
}}
// ======================================================================
// {{=iconProp }}
// ======================================================================

// less variable for {{=iconName }}
{{=iconProp }}:"{{=iconCode}}";

// mixin for {{=iconName }}
.mxn-{{=iconName }}(@insert-at:current) when not(@insert-at = props) {
  .{{=prefix}}code({{=iconProp}}, @insert-at);
}
.mxn-{{=iconName }}(props, @insert-at:current) {
  .{{=prefix}}code-prop({{=iconProp}}, @insert-at);
}
{{~}}