precision mediump float;

uniform vec3 colour;

void main() {
	if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;

	gl_FragColor = vec4( colour, 1.0 );
}