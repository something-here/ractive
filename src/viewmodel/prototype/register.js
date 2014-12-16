export default function Viewmodel$register ( keypath, dependant, group = 'default' ) {
	var mapping, depsByKeypath, deps;

	if ( dependant.isStatic ) {
		return; // TODO we should never get here if a dependant is static...
	}

	if ( mapping = this.mappings[ keypath.firstKey ] ) {
		mapping.register( keypath, dependant, group );
	}

	else {
		depsByKeypath = this.deps[ group ] || ( this.deps[ group ] = {} );
		deps = depsByKeypath[ keypath ] || ( depsByKeypath[ keypath ] = [] );

		deps.push( dependant );

		if ( !keypath.isRoot ) {
			updateDependantsMap( this, keypath, group );
		}
	}
}

function updateDependantsMap ( viewmodel, keypath, group ) {
	var map, parent;

	// update dependants map
	while ( !keypath.isRoot ) {
		map = viewmodel.depsMap[ group ] || ( viewmodel.depsMap[ group ] = {} );
		parent = map[ keypath.parent ] || ( map[ keypath.parent ] = [] );

		if ( parent[ keypath ] === undefined ) {
			parent[ keypath ] = 0;
			parent.push( keypath );
		}

		parent[ keypath ] += 1;
		keypath = keypath.parent;
	}
}
