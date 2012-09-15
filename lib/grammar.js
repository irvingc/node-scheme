/*
	Default driver template for JS/CC generated parsers for V8
	
	Features:
	- Parser trace messages
	- Step-by-step parsing
	- Integrated panic-mode error recovery
	- Pseudo-graphical parse tree generation
	
	Written 2007 by Jan Max Meyer, J.M.K S.F. Software Technologies
        Modified 2008 from driver.js_ to support V8 by Louis P.Santillan
			<lpsantil@gmail.com>
	
	This is in the public domain.
*/
 
var Scheme = require('../lib/definitions');


var _dbg_withparsetree	= false;
var _dbg_withtrace		= false;
var _dbg_withstepbystep	= false;

function __dbg_print( text )
{
	print( text );
}

function __dbg_wait()
{
   var v = read_line();
}

function __lex( info )
{
	var state		= 0;
	var match		= -1;
	var match_pos	= 0;
	var start		= 0;
	var pos			= info.offset + 1;

	do
	{
		pos--;
		state = 0;
		match = -2;
		start = pos;

		if( info.src.length <= start )
			return 15;

		do
		{

switch( state )
{
	case 0:
		if( info.src.charCodeAt( pos ) == 9 || info.src.charCodeAt( pos ) == 32 ) state = 1;
		else if( info.src.charCodeAt( pos ) == 40 ) state = 2;
		else if( info.src.charCodeAt( pos ) == 41 ) state = 3;
		else if( info.src.charCodeAt( pos ) == 43 ) state = 4;
		else if( info.src.charCodeAt( pos ) == 46 ) state = 5;
		else if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 6;
		else if( info.src.charCodeAt( pos ) == 34 ) state = 8;
		else if( info.src.charCodeAt( pos ) == 59 ) state = 9;
		else if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
		else state = -1;
		break;

	case 1:
		if( info.src.charCodeAt( pos ) == 9 || info.src.charCodeAt( pos ) == 32 ) state = 1;
		else if( info.src.charCodeAt( pos ) == 59 ) state = 9;
		else state = -1;
		match = 1;
		match_pos = pos;
		break;

	case 2:
		state = -1;
		match = 5;
		match_pos = pos;
		break;

	case 3:
		state = -1;
		match = 6;
		match_pos = pos;
		break;

	case 4:
		state = -1;
		match = 2;
		match_pos = pos;
		break;

	case 5:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 11;
		else state = -1;
		match = 7;
		match_pos = pos;
		break;

	case 6:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 6;
		else if( info.src.charCodeAt( pos ) == 46 ) state = 11;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 7:
		state = -1;
		match = 4;
		match_pos = pos;
		break;

	case 8:
		if( info.src.charCodeAt( pos ) == 34 ) state = 7;
		else if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 33 ) || ( info.src.charCodeAt( pos ) >= 35 && info.src.charCodeAt( pos ) <= 254 ) ) state = 8;
		else state = -1;
		break;

	case 9:
		if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 254 ) ) state = 9;
		else state = -1;
		match = 1;
		match_pos = pos;
		break;

	case 10:
		if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 31 ) || ( info.src.charCodeAt( pos ) >= 33 && info.src.charCodeAt( pos ) <= 39 ) || ( info.src.charCodeAt( pos ) >= 42 && info.src.charCodeAt( pos ) <= 254 ) ) state = 10;
		else state = -1;
		match = 2;
		match_pos = pos;
		break;

	case 11:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 11;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

}


			pos++;

		}
		while( state > -1 );

	}
	while( 1 > -1 && match == 1 );

	if( match > -1 )
	{
		info.att = info.src.substr( start, match_pos - start );
		info.offset = match_pos;
		
switch( match )
{
	case 2:
		{
		 info.att = new Scheme.Identifier(info.att); 
		}
		break;

	case 3:
		{
		 info.att = new Scheme.Number(info.att); 
		}
		break;

	case 4:
		{
		 info.att = new Scheme.String(info.att); 
		}
		break;

}


	}
	else
	{
		info.att = new String();
		match = -1;
	}

	return match;
}


function __parse( src, err_off, err_la )
{
	var		sstack			= new Array();
	var		vstack			= new Array();
	var 	err_cnt			= 0;
	var		act;
	var		go;
	var		la;
	var		rval;
	var 	parseinfo		= new Function( "", "var offset; var src; var att;" );
	var		info			= new parseinfo();
	
	//Visual parse tree generation
	var 	treenode		= new Function( "", "var sym; var att; var child;" );
	var		treenodes		= new Array();
	var		tree			= new Array();
	var		tmptree			= null;

/* Pop-Table */
var pop_tab = new Array(
	new Array( 0/* program' */, 1 ),
	new Array( 9/* program */, 1 ),
	new Array( 8/* form */, 1 ),
	new Array( 10/* expression */, 1 ),
	new Array( 10/* expression */, 1 ),
	new Array( 10/* expression */, 1 ),
	new Array( 11/* application */, 2 ),
	new Array( 11/* application */, 3 ),
	new Array( 11/* application */, 5 ),
	new Array( 14/* expressions */, 2 ),
	new Array( 14/* expressions */, 1 ),
	new Array( 12/* variable */, 1 ),
	new Array( 13/* constant */, 1 ),
	new Array( 13/* constant */, 1 )
);

/* Action-Table */
var act_tab = new Array(
	/* State 0 */ new Array( 5/* "(" */,7 , 2/* "IDENTIFIER" */,8 , 3/* "NUMBER" */,9 , 4/* "STRING" */,10 ),
	/* State 1 */ new Array( 15/* "$" */,0 ),
	/* State 2 */ new Array( 15/* "$" */,-1 ),
	/* State 3 */ new Array( 15/* "$" */,-2 , 6/* ")" */,-2 ),
	/* State 4 */ new Array( 15/* "$" */,-3 , 5/* "(" */,-3 , 2/* "IDENTIFIER" */,-3 , 3/* "NUMBER" */,-3 , 4/* "STRING" */,-3 , 6/* ")" */,-3 , 7/* "." */,-3 ),
	/* State 5 */ new Array( 15/* "$" */,-4 , 5/* "(" */,-4 , 2/* "IDENTIFIER" */,-4 , 3/* "NUMBER" */,-4 , 4/* "STRING" */,-4 , 6/* ")" */,-4 , 7/* "." */,-4 ),
	/* State 6 */ new Array( 15/* "$" */,-5 , 5/* "(" */,-5 , 2/* "IDENTIFIER" */,-5 , 3/* "NUMBER" */,-5 , 4/* "STRING" */,-5 , 6/* ")" */,-5 , 7/* "." */,-5 ),
	/* State 7 */ new Array( 6/* ")" */,12 , 5/* "(" */,7 , 2/* "IDENTIFIER" */,8 , 3/* "NUMBER" */,9 , 4/* "STRING" */,10 ),
	/* State 8 */ new Array( 15/* "$" */,-11 , 5/* "(" */,-11 , 2/* "IDENTIFIER" */,-11 , 3/* "NUMBER" */,-11 , 4/* "STRING" */,-11 , 6/* ")" */,-11 , 7/* "." */,-11 ),
	/* State 9 */ new Array( 15/* "$" */,-12 , 5/* "(" */,-12 , 2/* "IDENTIFIER" */,-12 , 3/* "NUMBER" */,-12 , 4/* "STRING" */,-12 , 6/* ")" */,-12 , 7/* "." */,-12 ),
	/* State 10 */ new Array( 15/* "$" */,-13 , 5/* "(" */,-13 , 2/* "IDENTIFIER" */,-13 , 3/* "NUMBER" */,-13 , 4/* "STRING" */,-13 , 6/* ")" */,-13 , 7/* "." */,-13 ),
	/* State 11 */ new Array( 6/* ")" */,14 , 7/* "." */,15 ),
	/* State 12 */ new Array( 15/* "$" */,-6 , 5/* "(" */,-6 , 2/* "IDENTIFIER" */,-6 , 3/* "NUMBER" */,-6 , 4/* "STRING" */,-6 , 6/* ")" */,-6 , 7/* "." */,-6 ),
	/* State 13 */ new Array( 5/* "(" */,7 , 2/* "IDENTIFIER" */,8 , 3/* "NUMBER" */,9 , 4/* "STRING" */,10 , 6/* ")" */,-10 , 7/* "." */,-10 ),
	/* State 14 */ new Array( 15/* "$" */,-7 , 5/* "(" */,-7 , 2/* "IDENTIFIER" */,-7 , 3/* "NUMBER" */,-7 , 4/* "STRING" */,-7 , 6/* ")" */,-7 , 7/* "." */,-7 ),
	/* State 15 */ new Array( 5/* "(" */,7 , 2/* "IDENTIFIER" */,8 , 3/* "NUMBER" */,9 , 4/* "STRING" */,10 ),
	/* State 16 */ new Array( 6/* ")" */,-9 , 7/* "." */,-9 ),
	/* State 17 */ new Array( 6/* ")" */,18 ),
	/* State 18 */ new Array( 15/* "$" */,-8 , 5/* "(" */,-8 , 2/* "IDENTIFIER" */,-8 , 3/* "NUMBER" */,-8 , 4/* "STRING" */,-8 , 6/* ")" */,-8 , 7/* "." */,-8 )
);

/* Goto-Table */
var goto_tab = new Array(
	/* State 0 */ new Array( 9/* program */,1 , 8/* form */,2 , 10/* expression */,3 , 11/* application */,4 , 12/* variable */,5 , 13/* constant */,6 ),
	/* State 1 */ new Array(  ),
	/* State 2 */ new Array(  ),
	/* State 3 */ new Array(  ),
	/* State 4 */ new Array(  ),
	/* State 5 */ new Array(  ),
	/* State 6 */ new Array(  ),
	/* State 7 */ new Array( 14/* expressions */,11 , 10/* expression */,13 , 11/* application */,4 , 12/* variable */,5 , 13/* constant */,6 ),
	/* State 8 */ new Array(  ),
	/* State 9 */ new Array(  ),
	/* State 10 */ new Array(  ),
	/* State 11 */ new Array(  ),
	/* State 12 */ new Array(  ),
	/* State 13 */ new Array( 14/* expressions */,16 , 10/* expression */,13 , 11/* application */,4 , 12/* variable */,5 , 13/* constant */,6 ),
	/* State 14 */ new Array(  ),
	/* State 15 */ new Array( 8/* form */,17 , 10/* expression */,3 , 11/* application */,4 , 12/* variable */,5 , 13/* constant */,6 ),
	/* State 16 */ new Array(  ),
	/* State 17 */ new Array(  ),
	/* State 18 */ new Array(  )
);



/* Symbol labels */
var labels = new Array(
	"program'" /* Non-terminal symbol */,
	"WHITESPACE" /* Terminal symbol */,
	"IDENTIFIER" /* Terminal symbol */,
	"NUMBER" /* Terminal symbol */,
	"STRING" /* Terminal symbol */,
	"(" /* Terminal symbol */,
	")" /* Terminal symbol */,
	"." /* Terminal symbol */,
	"form" /* Non-terminal symbol */,
	"program" /* Non-terminal symbol */,
	"expression" /* Non-terminal symbol */,
	"application" /* Non-terminal symbol */,
	"variable" /* Non-terminal symbol */,
	"constant" /* Non-terminal symbol */,
	"expressions" /* Non-terminal symbol */,
	"$" /* Terminal symbol */
);


	
	info.offset = 0;
	info.src = src;
	info.att = new String();
	
	if( !err_off )
		err_off	= new Array();
	if( !err_la )
	err_la = new Array();
	
	sstack.push( 0 );
	vstack.push( 0 );
	
	la = __lex( info );
			
	while( true )
	{
		act = 20;
		for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
		{
			if( act_tab[sstack[sstack.length-1]][i] == la )
			{
				act = act_tab[sstack[sstack.length-1]][i+1];
				break;
			}
		}

		/*
		_print( "state " + sstack[sstack.length-1] + " la = " + la + " info.att = >" +
				info.att + "< act = " + act + " src = >" + info.src.substr( info.offset, 30 ) + "..." + "<" +
					" sstack = " + sstack.join() );
		*/
		
		if( _dbg_withtrace && sstack.length > 0 )
		{
			__dbg_print( "\nState " + sstack[sstack.length-1] + "\n" +
							"\tLookahead: " + labels[la] + " (\"" + info.att + "\")\n" +
							"\tAction: " + act + "\n" + 
							"\tSource: \"" + info.src.substr( info.offset, 30 ) + ( ( info.offset + 30 < info.src.length ) ?
									"..." : "" ) + "\"\n" +
							"\tStack: " + sstack.join() + "\n" +
							"\tValue stack: " + vstack.join() + "\n" );
			
			if( _dbg_withstepbystep )
				__dbg_wait();
		}
		
			
		//Panic-mode: Try recovery when parse-error occurs!
		if( act == 20 )
		{
			if( _dbg_withtrace )
				__dbg_print( "Error detected: There is no reduce or shift on the symbol " + labels[la] );
			
			err_cnt++;
			err_off.push( info.offset - info.att.length );			
			err_la.push( new Array() );
			for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
				err_la[err_la.length-1].push( labels[act_tab[sstack[sstack.length-1]][i]] );
			
			//Remember the original stack!
			var rsstack = new Array();
			var rvstack = new Array();
			for( var i = 0; i < sstack.length; i++ )
			{
				rsstack[i] = sstack[i];
				rvstack[i] = vstack[i];
			}
			
			while( act == 20 && la != 15 )
			{
				if( _dbg_withtrace )
					__dbg_print( "\tError recovery\n" +
									"Current lookahead: " + labels[la] + " (" + info.att + ")\n" +
									"Action: " + act + "\n\n" );
				if( la == -1 )
					info.offset++;
					
				while( act == 20 && sstack.length > 0 )
				{
					sstack.pop();
					vstack.pop();
					
					if( sstack.length == 0 )
						break;
						
					act = 20;
					for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
					{
						if( act_tab[sstack[sstack.length-1]][i] == la )
						{
							act = act_tab[sstack[sstack.length-1]][i+1];
							break;
						}
					}
				}
				
				if( act != 20 )
					break;
				
				for( var i = 0; i < rsstack.length; i++ )
				{
					sstack.push( rsstack[i] );
					vstack.push( rvstack[i] );
				}
				
				la = __lex( info );
			}
			
			if( act == 20 )
			{
				if( _dbg_withtrace )
					__dbg_print( "\tError recovery failed, terminating parse process..." );
				break;
			}


			if( _dbg_withtrace )
				__dbg_print( "\tError recovery succeeded, continuing" );
		}
		
		/*
		if( act == 20 )
			break;
		*/
		
		
		//Shift
		if( act > 0 )
		{
			//Parse tree generation
			if( _dbg_withparsetree )
			{
				var node = new treenode();
				node.sym = labels[ la ];
				node.att = info.att;
				node.child = new Array();
				tree.push( treenodes.length );
				treenodes.push( node );
			}
			
			if( _dbg_withtrace )
				__dbg_print( "Shifting symbol: " + labels[la] + " (" + info.att + ")" );
		
			sstack.push( act );
			vstack.push( info.att );
			
			la = __lex( info );
			
			if( _dbg_withtrace )
				__dbg_print( "\tNew lookahead symbol: " + labels[la] + " (" + info.att + ")" );
		}
		//Reduce
		else
		{		
			act *= -1;
			
			if( _dbg_withtrace )
				__dbg_print( "Reducing by producution: " + act );
			
			rval = void(0);
			
			if( _dbg_withtrace )
				__dbg_print( "\tPerforming semantic action..." );
			
switch( act )
{
	case 0:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 1:
	{
		 Scheme.addProgramTree(vstack[ vstack.length - 1 ]); 
	}
	break;
	case 2:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 3:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 4:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 5:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 6:
	{
		 rval = new Scheme.Null(); 
	}
	break;
	case 7:
	{
		 rval = vstack[ vstack.length - 2 ]; 
	}
	break;
	case 8:
	{
		 vstack[ vstack.length - 4 ].setCDR(vstack[ vstack.length - 2 ]); rval = vstack[ vstack.length - 4 ]; 
	}
	break;
	case 9:
	{
		 rval = new Scheme.Cons(vstack[ vstack.length - 2 ], vstack[ vstack.length - 1 ]); 
	}
	break;
	case 10:
	{
		 rval = new Scheme.Cons(vstack[ vstack.length - 1 ]); 
	}
	break;
	case 11:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 12:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 13:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
}


			
			if( _dbg_withparsetree )
				tmptree = new Array();

			if( _dbg_withtrace )
				__dbg_print( "\tPopping " + pop_tab[act][1] + " off the stack..." );
				
			for( var i = 0; i < pop_tab[act][1]; i++ )
			{
				if( _dbg_withparsetree )
					tmptree.push( tree.pop() );
					
				sstack.pop();
				vstack.pop();
			}
									
			go = -1;
			for( var i = 0; i < goto_tab[sstack[sstack.length-1]].length; i+=2 )
			{
				if( goto_tab[sstack[sstack.length-1]][i] == pop_tab[act][0] )
				{
					go = goto_tab[sstack[sstack.length-1]][i+1];
					break;
				}
			}
			
			if( _dbg_withparsetree )
			{
				var node = new treenode();
				node.sym = labels[ pop_tab[act][0] ];
				node.att = new String();
				node.child = tmptree.reverse();
				tree.push( treenodes.length );
				treenodes.push( node );
			}
			
			if( act == 0 )
				break;
				
			if( _dbg_withtrace )
				__dbg_print( "\tPushing non-terminal " + labels[ pop_tab[act][0] ] );
				
			sstack.push( go );
			vstack.push( rval );			
		}
	}

	if( _dbg_withtrace )
		__dbg_print( "\nParse complete." );

	if( _dbg_withparsetree )
	{
		if( err_cnt == 0 )
		{
			__dbg_print( "\n\n--- Parse tree ---" );
			__dbg_parsetree( 0, treenodes, tree );
		}
		else
		{
			__dbg_print( "\n\nParse tree cannot be viewed. There where parse errors." );
		}
	}
	
	return err_cnt;
}


function __dbg_parsetree( indent, nodes, tree )
{
	var str = new String();
	for( var i = 0; i < tree.length; i++ )
	{
		str = "";
		for( var j = indent; j > 0; j-- )
			str += "\t";
		
		str += nodes[ tree[i] ].sym;
		if( nodes[ tree[i] ].att != "" )
			str += " >" + nodes[ tree[i] ].att + "<" ;
			
		__dbg_print( str );
		if( nodes[ tree[i] ].child.length > 0 )
			__dbg_parsetree( indent + 1, nodes, nodes[ tree[i] ].child );
	}
}



//_dbg_withtrace = true;
//_dbg_withparsetree = true;
//_dbg_withstepbystep = true;

Scheme.parse = __parse;
module.exports = Scheme;



