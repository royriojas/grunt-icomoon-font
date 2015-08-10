{{
  var
    fontData = it.fontData || {},
    name = fontData.name,
    prefix = fontData.prefix,
    mixinsFile = it.mixinsFile;
}}

@font-face {
  font-family: '{{= name }}';
  src:url('fonts/{{= name }}.eot?y6en6y');
  src:url('fonts/{{= name }}.eot?#iefixy6en6y') format('embedded-opentype'),
    url('fonts/{{= name }}.woff?y6en6y') format('woff'),
    url('fonts/{{= name }}.ttf?y6en6y') format('truetype'),
    url('fonts/{{= name }}.svg?y6en6y') format('svg');
  font-weight: normal;
  font-style: normal;
}
