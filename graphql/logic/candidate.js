const createAndUpdatePretCandidate = exports.createAndUpdatePretCandidate =  ( field, TC ) => {
	return TC.get('$createOne').wrapResolve(next => async (rp) => {
		//get contextPretCandidate from resolveParams (rp)
		const { contextPretCandidate } = rp
		const _field = contextPretCandidate[field]
		if (Array.isArray(_field)) {
			//add field to db and get result of createOne resolver
			const result = await next(rp);
			contextPretCandidate[field].push(result.recordId);
			try {
				await contextPretCandidate.save();
				return result;
			} catch (e) {
				//Placeholder function to stop the field from saving to the db
				result.record.remove().exec();
				throw new Error(`Unexpected error adding the document to candidate`);
			}
		} else {
			throw new Error(`Field: ${field} is not an collection field`);
		}
	});
}

const updatePretCandidateRelationshipField = exports.updatePretCandidateRelationshipField = ( field, TC ) => {
	return TC.get('$updateById').wrapResolve(next => async (rp) => {
		//get contextPretCandidate from resolveParams (rp)
		const { contextPretCandidate, args } = rp
		const _field = contextPretCandidate[field]
		if (Array.isArray(_field)) {
			let exist = _field.find((fieldId)=>(fieldId==args.record._id));
			if (exist){
				//add field to db and get result of createOne resolver
				const result = await next(rp);
				return result;
			} else {
				throw new Error(`This candidate cannot edit this field`);
			}
		} else {
			throw new Error(`Field: ${field} is not an collection field`);
		}
	});
}

const updatePretCandidate = exports.updatePretCandidate = ( TC ) => {
	return TC.get('$updateById').wrapResolve(next => async (rp) => {
		//get contextPretCandidate from resolveParams (rp)
		const { contextPretCandidate, args } = rp
		if (contextPretCandidate._id == args.record._id){
      const result = await next(rp);
      return result;
    } else {
      throw new Error(`This candidate cannot edit this field`);
    }
	});
}

const candidateAccess = exports.candidateAccess = (resolvers) => {
  Object.keys(resolvers).forEach((k) => {
    resolvers[k] = resolvers[k].wrapResolve(next => async (rp) => {
      //const { source, args, context, info } = resolveParams = rp
			try {
				const candidate = await rp.context.PretCandidate;
				if (!candidate){
					console.log('Unauthorized request');
					//console.log(new Error('You must be signed in as a candidate, to have access to this action.'));
					throw new Error('You must be signed in as a candidate, to have access to this action.')
				}
				//console.log('authorized');
				//add signed-In candidate to the resolver parameters
				rp.contextPretCandidate = candidate || null;
	      return next(rp);
			} catch (e) {
				return e;
			}
    });
  });
  return resolvers;
}
