package com.fgwater.frame.mapper.wbb;

import java.util.List;
import java.util.Map;

import com.fgwater.core.annotation.Paging;
import com.fgwater.core.mapper.BaseMapper;
import com.fgwater.frame.model.wbb.Standard;

public interface StandardMapper extends BaseMapper<Standard> {

	@Paging
	public List<Map<String, String>> query(Map<String, String> params);

}
