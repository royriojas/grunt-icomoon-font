{{
  var
    fontData = it.fontData || {},
    name = fontData.name,
    prefix = fontData.prefix,
    mixinsFile = it.mixinsFile,
    fontDefFile = it.fontDefFile;
}}
@import '{{=mixinsFile}}';

@import '{{=fontDefFile}}';

[class^="{{=prefix}}"], [class*=" {{=prefix}}"], .{{=prefix}}font-props {
  &:before,
  &:after {
    .{{=prefix}}props();
  }
}

.ico {
  margin-right: .5em;
  margin-left: .5em;
}

{{~ fontData.icons :icon:index }}
{{
  var
    iconName = icon.className,
    iconProp = '@'+ prefix + 'code-' + iconName,
    iconCode = icon.hexCode;
}}
// ======================================================================
// {{=iconProp }}
// ======================================================================

// class for {{=iconName }}
.{{= iconName }} {
  .mxn-{{=iconName }}(before);
}
{{~}}
