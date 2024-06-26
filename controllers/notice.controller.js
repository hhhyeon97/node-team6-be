const { response } = require('express');
const Notice = require('../models/Notice');
const noticeController = {};

// [ 공지사항 작성 ]
noticeController.createNotice = async (req, res) => {
  try {
    const { userId } = req;
    const { title, content, img, isImportant } = req.body;
    console.log("title",title.length)
    // 공지사항 내용 검사
    if (!title.trim()) throw new Error('제목을 입력해주세요');
    if (!content.trim()) throw new Error('내용을 입력해주세요');
    if (title.length < 4) throw new Error('최소 4자 이상 작성해주세요');
    if (title.length > 25) throw new Error('제목의 길이는 최대 25자 입니다');
    if (content.length < 15) throw new Error('최소 15자 이상 작성해주세요');

    const notice = await Notice({
      userId,
      title,
      content,
      img,
      isImportant,
    });
    await notice.save();
    return res.status(200).json({ status: 'success', notice });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// [ 공지사항 리스트 가져오기 ]
noticeController.getNoticeList = async (req, res) => {
  try {
    const PAGE_SIZE = 5;
    const { page, title } = req.query;

    const cond = {
      ...(title && { title: { $regex: title, $options: 'i' } }),
    };
    let query = Notice.find(cond)
      .populate({ path: 'userId', model: 'User' })
      .sort({ createdAt: -1 });
    let response = { status: 'success' };

    if (page) {
      query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
      const totalItemNum = await Notice.find(cond).count();
      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
      response.totalPageNum = totalPageNum;
    }

    const noticeList = await query.exec();
    response.data = noticeList;

    if (noticeList) {
      return res.status(200).json(response);
    }
    throw new Error('공지사항이 없거나 잘못되었습니다');
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
};

// [ 공지사항 수정하기 ]
noticeController.editNotice = async (req, res) => {
  try {
    const { userId } = req;
    const noticetId = req.params.id;
    const { title, content, img, isImportant } = req.body;

    const existingNotice = await Notice.findById(noticetId);
    if (!existingNotice) {
      throw new Error('공지사항이 존재하지 않습니다');
    }

    // 공지사항을 수정할 권한이 있는지 확인
    if (existingNotice.userId.toString() !== userId.toString()) {
      throw new Error('수정 권한이 없습니다');
    }

    // 공지사항 내용 검사
    if (!title.trim()) throw new Error('제목을 입력해주세요');
    if (!content.trim()) throw new Error('내용을 입력해주세요');
    if (content.length < 15) throw new Error('최소 15자 이상 작성해주세요');
    if (title.length < 4) throw new Error('최소 4자 이상 작성해주세요');
    if (title.length > 25) throw new Error('제목의 길이는 최대 25자 입니다');

    // 공지사항 수정
    existingNotice.title = title;
    existingNotice.content = content;
    existingNotice.img = img;
    existingNotice.isImportant = isImportant;

    await existingNotice.save();
    res.status(200).json({ status: 'success', data: existingNotice });
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
};

// [ 공지사항 삭제 ]
noticeController.deleteNotice = async (req, res) => {
  try {
    const { userId } = req;
    const noticeId = req.params.id;

    const existingNotice = await Notice.findById(noticeId);
    if (!existingNotice) {
      throw new Error('공지사항이 존재하지 않습니다');
    }

    // 공지사항을 삭제할 권한이 있는지 확인
    if (existingNotice.userId.toString() !== userId.toString()) {
      throw new Error('삭제 권한이 없습니다');
    }

    // 공지사항 삭제
    const deletedNotice = await Notice.findOneAndDelete({ _id: noticeId });

    // 모든 공지사항 목록 가져오기
    const noticeList = await Notice.find().sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: noticeList });
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
};

noticeController.getNoticeListVer2 = async (req, res) => {
  try {
    const PAGE_SIZE = 5;
    const { page, title } = req.query;
    const pageNum = parseInt(page) || 1;

    const cond = {
      ...(title && { title: { $regex: title, $options: 'i' } }),
    };

    // 중요 공지사항 가져오기
    const importantNotices = await Notice.find({ ...cond, isImportant: true })
      .populate({ path: 'userId', model: 'User' })
      .sort({ createdAt: -1 });

    // 일반 공지사항 가져오기 (중요 공지사항은 제외)
    const normalNotices = await Notice.find({ ...cond, isImportant: false })
      .populate({ path: 'userId', model: 'User' })
      .sort({ createdAt: -1 });

    // 모든 공지사항을 결합
    const allNotices = importantNotices.concat(normalNotices);

    // 페이지네이션 적용
    const totalItemNum = allNotices.length;
    const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
    const paginatedNotices = allNotices.slice(
      (pageNum - 1) * PAGE_SIZE,
      pageNum * PAGE_SIZE,
    );

    const response = {
      status: 'success',
      data: paginatedNotices,
      totalPageNum,
    };

    return res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
};

// 메인푸터 공지사항 가져오기
noticeController.getMainPageNoticeList = async(req,res) => {
  try{
    const {size} = req.query;
    const notice = await Notice.find({isImportant:true}).limit(size);
    res.status(200).json({status:"success", data:notice})
  }catch(error){
    res.status(400).json({status:"fail", error:error.message});
  }
}

module.exports = noticeController;
