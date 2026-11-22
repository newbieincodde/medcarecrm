/**
 * ==============================================================================
 * MEDCARE CRM — Medical Knowledge Base & Nationwide Facilities (40 Facilities)
 * Dữ liệu y khoa chuyên sâu: 16 Chuyên khoa & 40 Cơ sở y tế toàn quốc
 * ==============================================================================
 */

// ── 1. CẨM NANG KIẾN THỨC 16 CHUYÊN KHOA Y TẾ (MEDPRO COMPLIANT) ──
const SPECIALTIES_KNOWLEDGE = {
  tieu_hoa_gan_mat: {
    id: 'tieu_hoa_gan_mat',
    name: 'Tiêu Hóa Gan Mật',
    icon: '🫁',
    badge: 'Chuyên khoa trọng điểm',
    symptoms: [
      'Vàng da, vàng lòng trắng mắt, nước tiểu sẫm màu như nước chè đặc',
      'Đau tức hạ sườn phải âm ỉ hoặc quặn từng cơn sau khi ăn đồ dầu mỡ',
      'Bụng trướng to, phù hai chi dưới, xuất hiện sao mạch trên ngực',
      'Sốt nhẹ kèm lạnh run, ngứa ngáy toàn thân, chán ăn, sụt cân',
      'Chảy máu cam, chảy máu chân răng khó cầm, hay bầm tím dưới da'
    ],
    diseases: [
      'Viêm gan siêu vi B, C mạn tính có nguy cơ tiến triển xơ gan',
      'Bệnh gan nhiễm mỡ do rượu bia và rối loạn chuyển hóa (NAFLD/NASH)',
      'Sỏi túi mật, sỏi đường mật trong gan và viêm túi mật cấp',
      'Xơ gan còn bù, xơ gan mất bù và Tầm soát ung thư biểu mô tế bào gan (HCC)',
      'Viêm tụy cấp, viêm tụy mạn tính và u bóng Vater'
    ],
    equipment: [
      'Máy siêu âm đàn hồi mô gan FibroScan 502 Touch đo độ xơ hóa và mỡ gan',
      'Hệ thống chụp cắt lớp vi tính MSCT 128 - 640 lát cắt gan mật có cản quang',
      'Máy nội soi mật tụy ngược dòng ERCP lấy sỏi không cần mổ hở',
      'Hệ thống sinh hóa tự động Roche Cobas định lượng men gan và dấu ấn ung thư gan AFP/AFP-L3'
    ],
    doctors: 'PGS.TS.BS Trần Ngọc Bảo, BSCKII Nguyễn Thị Thu Hà, TS.BS Lê Thành Đạt',
    hospitals: 'BV Đại học Y Dược TP.HCM, BV Chợ Rẫy, BV Bạch Mai, Medic Hòa Hảo'
  },
  noi_tong_quat: {
    id: 'noi_tong_quat',
    name: 'Nội Tổng Quát',
    icon: '📋',
    badge: 'Khám toàn diện ban đầu',
    symptoms: [
      'Mệt mỏi kéo dài không rõ nguyên nhân, suy nhược cơ thể, chán ăn',
      'Sụt cân nhanh không chủ ý hoặc tăng cân đột ngột không kiểm soát',
      'Sốt âm ỉ kéo dài về chiều, hay đổ mồ hôi trộm ban đêm',
      'Chóng mặt hoa mắt khi thay đổi tư thế, choáng váng mệt lả',
      'Rối loạn giấc ngủ, hồi hộp lo âu, cảm giác khó chịu đa cơ quan'
    ],
    diseases: [
      'Rối loạn chuyển hóa lipid máu (tăng Cholesterol, Triglyceride)',
      'Hội chứng mệt mỏi mạn tính (CFS) và suy nhược thần kinh cơ thể',
      'Thiếu máu thiếu sắt, thiếu máu dinh dưỡng do kém hấp thu',
      'Tầm soát bệnh lý đa cơ quan tiềm ẩn người trung niên và cao tuổi',
      'Theo dõi và điều trị phối hợp nhiều bệnh lý nội khoa mạn tính nền'
    ],
    equipment: [
      'Hệ thống phân tích huyết học tự động 24 thông số Sysmex Nhật Bản',
      'Máy đo điện tâm đồ ECG kỹ thuật số 12 đạo trình vi tính hóa',
      'Hệ thống chụp X-quang kỹ thuật số liều tia thấp DR Carestream',
      'Máy siêu âm màu tổng quát 5 tạng ổ bụng công nghệ Doppler phân giải cao'
    ],
    doctors: 'BSCKII Mai Hương, BSCKII Trần Văn Hùng, ThS.BS Lê Thị Lan',
    hospitals: 'BV Bạch Mai, BV Chợ Rẫy, PK Đa khoa Hàng Xanh, PK Bernard Clinic'
  },
  noi_tiet: {
    id: 'noi_tiet',
    name: 'Nội Tiết & Chuyển Hóa',
    icon: '⚥',
    badge: 'Bệnh lý mạn tính',
    symptoms: [
      'Uống nhiều, tiểu nhiều (đặc biệt tiểu đêm 3 - 5 lần), khát nước liên tục',
      'Ăn nhiều nhưng sút cân nhanh, sụt 3 - 5kg trong vòng vài tuần',
      'Vết thương ngoài da lâu lành, vết trầy xước dễ nhiễm trùng, mưng mủ',
      'Run đầu ngón tay, hồi hộp đánh trống ngực, vã mồ hôi, sợ nóng',
      'Cổ to bất thường (bướu cổ), nuốt vướng, khàn tiếng hoặc mắt lồi'
    ],
    diseases: [
      'Đái tháo đường (Tiểu đường) Tuýp 1, Tuýp 2 và Đái tháo đường thai kỳ',
      'Bướu nhân tuyến giáp lành tính, Cường giáp Basedow và Suy giáp',
      'Viêm tuyến giáp Hashimoto mạn tính & Tầm soát ung thư tuyến giáp',
      'Bệnh lý tuyến thượng thận (Hội chứng Cushing, suy thượng thận mạn)',
      'Rối loạn hormone sinh dục và loãng xương sau mãn kinh'
    ],
    equipment: [
      'Hệ thống đo chỉ số HbA1c tự động sắc ký lỏng cao áp HPLC chuẩn quốc tế',
      'Máy siêu âm tuyến giáp Doppler màu phân giải cao phân loại TIRADS',
      'Hệ thống miễn dịch tự động Cobas e801 định lượng hormone TSH, FT3, FT4, Cortisol',
      'Kim chọc hút tế bào học tuyến giáp bằng kim nhỏ (FNA) dưới hướng dẫn siêu âm'
    ],
    doctors: 'BSCKII Lê Thanh Mai, TS.BS Hoàng Trung Dũng, ThS.BS Nguyễn Thu Hà',
    hospitals: 'BV Nội Tiết Trung Ương, BV Chợ Rẫy, BV Bạch Mai, BV Đại học Y Hà Nội'
  },
  da_lieu: {
    id: 'da_lieu',
    name: 'Da Liễu & Thẩm Mỹ Da Y Khoa',
    icon: '🧴',
    badge: 'Chăm sóc toàn diện',
    symptoms: [
      'Nổi mẩn đỏ, ngứa ngáy dữ dội tái đi tái lại nhiều đợt không dứt',
      'Mụn trứng cá bọc, mụn viêm nang, mụn mủ dai dẳng để lại thâm sẹo rỗ',
      'Da khô bong tróc vảy trắng, nứt nẻ chảy máu ở bàn tay, bàn chân',
      'Nổi mề đay phù mạch, ban dị ứng do thời tiết, mỹ phẩm hoặc thức ăn',
      'Xuất hiện nốt ruồi lạ đổi màu, tàn nhang, nám đốm sâu, rụng tóc từng mảng'
    ],
    diseases: [
      'Viêm da cơ địa (Eczema), viêm da tiết bã và viêm da tiếp xúc dị ứng',
      'Mụn trứng cá nặng, mụn nội tiết & Thâm mụn, sẹo lõm sau mụn',
      'Bệnh Vảy nến (Psoriasis), á sừng và tổ đỉa bàn tay chân',
      'Nhiễm nấm da, nấm móng, lang ben, Zona thần kinh (giời leo)',
      'Nám sạm melasma, lão hóa da, tàn nhang và Rụng tóc hói đầu (Alopecia)'
    ],
    equipment: [
      'Máy soi da kỹ thuật số vi điểm đa tầng 3D Dermatoscope',
      'Hệ thống Laser PicoSure, Laser Fractional CO2 điều trị sẹo và sắc tố',
      'Buồng chiếu ánh sáng sinh học UVB trị liệu bệnh vảy nến và bạch biến',
      'Công nghệ điện di vi kim tinh chất phục hồi màng đáy sinh học làn da'
    ],
    doctors: 'BSCKII Đoàn Văn Lợi Em, ThS.BS Nguyễn Bích Ngọc, TS.BS Trần Hữu Vinh',
    hospitals: 'BV Da Liễu TP.HCM, BV Da Liễu Trung Ương, PK Da Liễu BS Đoàn Văn Lợi Em'
  },
  tim_mach: {
    id: 'tim_mach',
    name: 'Nội Tim Mạch',
    icon: '❤️',
    badge: 'Chuyên khoa trọng điểm',
    symptoms: [
      'Đau tức ngực trái, cảm giác đè nặng bóp nghẹt lan ra vai trái hoặc sau lưng',
      'Hồi hộp, đánh trống ngực, tim đập nhanh hoặc loạn nhịp bất thường từng cơn',
      'Khó thở khi nằm đầu thấp hoặc khi leo cầu thang, gắng sức nhẹ',
      'Huyết áp dao động, thường xuyên trên 140/90 mmHg hoặc tụt dưới 90/60 mmHg',
      'Chóng mặt, choáng váng, ngất xỉu đột ngột không rõ nguyên nhân'
    ],
    diseases: [
      'Bệnh động mạch vành & Thiếu máu cơ tim cục bộ',
      'Tăng huyết áp vô căn & Bệnh tim do tăng huyết áp lâu năm',
      'Suy tim sung huyết mạn tính các phân độ NYHA',
      'Rối loạn nhịp tim (Rung nhĩ, ngoại tâm thu thất, nhịp nhanh trên thất)',
      'Bệnh van tim (Hở van 2 lá, hẹp hở van động mạch chủ)'
    ],
    equipment: [
      'Máy đo điện tâm đồ kỹ thuật số ECG 12 đạo trình vi tính hóa',
      'Siêu âm tim màu Doppler tim 4D công nghệ cao Philips Affiniti',
      'Hệ thống theo dõi huyết áp & nhịp tim Holter 24h Meditech',
      'Máy chụp cắt lớp vi tính MSCT 640 lát cắt dựng hình cây mạch vành không xâm lấn'
    ],
    doctors: 'PGS.TS.BS Nguyễn Văn Thông, BSCKII Trần Minh Tuấn, PGS.TS Phạm Mạnh Hùng',
    hospitals: 'BV Chợ Rẫy, Viện Tim TP.HCM, BV Bạch Mai, BV Đa khoa Tâm Anh'
  },
  than_kinh: {
    id: 'than_kinh',
    name: 'Nội Thần Kinh',
    icon: '🧠',
    badge: 'Kỹ thuật chẩn đoán cao',
    symptoms: [
      'Đau đầu dữ dội kéo dài, đau nửa đầu nhói giật kèm buồn nôn sợ ánh sáng',
      'Mất ngủ mạn tính, khó vào giấc, hay giật mình thức giấc giữa đêm không ngủ lại',
      'Méo miệng, tê một bên mặt, nói ngọng khó phát âm đột ngột (dấu hiệu FAST)',
      'Yếu liệt nửa người hoặc tay chân run rẩy khó kiểm soát khi cầm nắm',
      'Hay quên, suy giảm trí nhớ nghiêm trọng, lú lẫn lẫn lộn thời gian không gian'
    ],
    diseases: [
      'Thiểu năng tuần hoàn não (Thiếu máu não cục bộ thoáng qua TIA)',
      'Tầm soát và điều trị dự phòng Đột quỵ / Tai biến mạch máu não tái phát',
      'Đau đầu Migraine & Đau đầu do căng thẳng thần kinh áp lực công việc',
      'Hội chứng Rối loạn tiền đình ngoại biên & Rối loạn giấc ngủ suy nhược',
      'Bệnh Parkinson (run tay chân) & Suy giảm nhận thức Alzheimer người cao tuổi'
    ],
    equipment: [
      'Hệ thống đo điện não đồ EEG 32 kênh kỹ thuật số phát hiện sóng động kinh',
      'Máy chụp cộng hưởng từ sọ não MRI 1.5 - 3.0 Tesla khảo sát mạch máu não mạch TOF',
      'Máy siêu âm Doppler màu xuyên sọ TCD đánh giá tốc độ dòng máu não',
      'Máy đo điện cơ EMG khảo sát tổn thương dẫn truyền thần kinh cơ'
    ],
    doctors: 'TS.BS Nguyễn Văn An, BSCKII Vũ Đức Long, PGS.TS Mai Duy Tôn',
    hospitals: 'BV Chợ Rẫy, BV Nhân Dân 115, BV Bạch Mai, BV Quân Y 108'
  },
  co_xuong_khop: {
    id: 'co_xuong_khop',
    name: 'Nội Cơ Xương Khớp',
    icon: '🦴',
    badge: 'Phục hồi vận động',
    symptoms: [
      'Đau nhức thắt lưng lan xuống mông và cẳng chân (đau dây thần kinh tọa)',
      'Đau khớp gối khi lên xuống cầu thang, có tiếng kêu lục cục lạo xạo trong khớp',
      'Cứng khớp buổi sáng kéo dài trên 30 phút khó nắm mở bàn tay',
      'Sưng nóng đỏ đau dữ dội tại khớp ngón chân cái ban đêm (nghi ngờ gút cấp)',
      'Tê bì đầu ngón tay ngón chân, teo cơ mu bàn tay hoặc yếu chi'
    ],
    diseases: [
      'Thoái hóa khớp gối, thoái hóa cột sống cổ và thoái hóa thắt lưng',
      'Thoát vị đĩa đệm cột sống & Chèn ép rễ thần kinh tọa',
      'Viêm khớp dạng thấp mạn tính phá hủy khớp đối xứng',
      'Bệnh Gút (Gout) cấp và mạn tính lắng đọng tinh thể urat tophi',
      'Loãng xương người lớn tuổi & Viêm điểm bám gân gót Achilles'
    ],
    equipment: [
      'Hệ thống đo mật độ loãng xương DEXA toàn thân tiêu chuẩn vàng Hologic',
      'Máy chụp cộng hưởng từ MRI khớp chuyên dụng 1.5 Tesla',
      'Hệ thống siêu âm khớp độ phân giải cao dẫn đường tiêm chất nhờn/PRP',
      'Bộ ly tâm sinh học chiết tách huyết tương giàu tiểu cầu PRP tự thân'
    ],
    doctors: 'PGS.TS.BS Đỗ Văn Hùng, BSCKII Hoàng Nam, TS.BS Tăng Hà Nam Anh',
    hospitals: 'BV Chấn Thương Chỉnh Hình, BV Việt Đức, BV Bạch Mai, BV Tâm Anh'
  },
  tai_mui_hong: {
    id: 'tai_mui_hong',
    name: 'Tai Mũi Họng',
    icon: '👂',
    badge: 'Phổ biến mọi lứa tuổi',
    symptoms: [
      'Đau rát họng kéo dài, cảm giác vướng đờm ở cổ họng, khàn tiếng trên 2 tuần',
      'Nghẹt mũi luân phiên, chảy nước mũi xanh vàng đặc, mất mùi giảm ngửi',
      'Đau nhức vùng trán, má, hốc mắt tăng lên khi cúi đầu do viêm xoang',
      'Ù tai, nghe kém, có tiếng ve kêu trong tai hoặc chảy dịch mủ tai',
      'Ngủ ngáy to, thở khò khè, có những cơn ngưng thở khi ngủ'
    ],
    diseases: [
      'Viêm amidan hốc mủ, viêm họng hạt mạn tính tái phát nhiều lần',
      'Viêm mũi xoang dị ứng thời tiết & Viêm đa xoang mạn tính có polyp',
      'Viêm tai giữa mủ cấp tính, viêm tai ngoài nấm, thủng màng nhĩ',
      'Hạt xơ dây thanh, polyp thanh quản gây biến đổi giọng nói',
      'Tầm soát ung thư vòm họng và ung thư thanh quản giai đoạn sớm'
    ],
    equipment: [
      'Hệ thống nội soi Tai Mũi Họng ống mềm Carl Zeiss công nghệ ánh sáng dải tần hẹp NBI',
      'Máy đo thính lực đơn âm và nhĩ lượng đồ vi tính hóa Interacoustics Đan Mạch',
      'Hệ thống dao Plasma / Coblator II cắt amidan nạo VA nhiệt độ thấp không chảy máu',
      'Kính hiển vi phẫu thuật tai Leica độ phóng đại lớn'
    ],
    doctors: 'BSCKII Phạm Quốc Hùng, ThS.BS Hoàng Minh Châu, BSCKII Nguyễn Vĩnh Phước',
    hospitals: 'BV Tai Mũi Họng TP.HCM, BV Tai Mũi Họng Trung Ương, BV Chợ Rẫy'
  },
  mat: {
    id: 'mat',
    name: 'Mắt & Khúc Xạ',
    icon: '👁️',
    badge: 'Công nghệ phẫu thuật cao',
    symptoms: [
      'Nhìn mờ, thấy bóng đôi, mỏi mắt nhức mắt khi nhìn màn hình máy tính',
      'Khô mắt, cay rát mắt, cộm xốn như có cát hạt bụi trong mắt',
      'Thấy vệt đen lượn lờ trước mắt như ruồi bay, thấy chớp sáng lóe lên',
      'Mắt đỏ, đổ ghèn nhiều, đau nhức sâu quanh hốc mắt kèm đau đầu',
      'Thị lực sụt giảm nhanh đột ngột hoặc nhìn hình ảnh bị méo mó biến dạng'
    ],
    diseases: [
      'Tật khúc xạ học đường & văn phòng: Cận thị, viễn thị, loạn thị, lão thị',
      'Đục thủy tinh thể (Cườm khô) phổ biến ở người cao tuổi',
      'Glaucoma (Cườm nước) tăng nhãn áp tiềm ẩn nguy cơ mù lòa vĩnh viễn',
      'Hội chứng khô mắt văn phòng & Thoái hóa hoàng điểm tuổi già (AMD)',
      'Viêm kết mạc cấp (Đau mắt đỏ), viêm loét giác mạc do kính áp tròng'
    ],
    equipment: [
      'Máy đo khúc xạ tự động và đo bản đồ giác mạc Wavefront Topolyzer',
      'Hệ thống phẫu thuật Phaco Centurion Alcon điều trị đục thủy tinh thể',
      'Máy chụp cắt lớp quang học đáy mắt võng mạc OCT Cirrus HD-OCT Zeiss',
      'Hệ thống Laser Femtosecond VisuMax xóa cận ReLEx SMILE hiện đại nhất'
    ],
    doctors: 'TS.BS Vũ Anh Tuấn, ThS.BS Lê Thị Thanh Mai, BSCKII Nguyễn Đỗ Nguyên',
    hospitals: 'BV Mắt TP.HCM, BV Mắt Trung Ương, BV Mắt Quốc tế Á Châu'
  },
  noi_tieu_hoa: {
    id: 'noi_tieu_hoa',
    name: 'Nội Tiêu Hoá',
    icon: '🥣',
    badge: 'Khám nhiều nhất',
    symptoms: [
      'Đau tức vùng thượng vị trên rốn, đau cồn cào lúc đói hoặc đau tức sau ăn no',
      'Ợ chua, ợ hơi, trào ngược thức ăn lên họng gây nóng rát sau xương ức',
      'Đầy hơi khó tiêu, chướng bụng, ăn mau no, buồn nôn sau bữa ăn',
      'Đi tiêu phân lỏng nhiều lần trong ngày xen kẽ những đợt táo bón kéo dài',
      'Đi cầu phân sống, phân đen sệt hoặc có dính chất nhầy lẫn tia máu'
    ],
    diseases: [
      'Viêm loét dạ dày - tá tràng & Nhiễm khuẩn Helicobacter Pylori (HP)',
      'Trào ngược dạ dày thực quản (GERD) độ A, B, C theo phân loại Los Angeles',
      'Hội chứng ruột kích thích (IBS) thể tiêu chảy / táo bón hỗn hợp',
      'Viêm đại tràng co thắt mạn tính & Viêm loét đại trực tràng chảy máu',
      'Polyp niêm mạc dạ dày và polyp đại trực tràng cần nội soi cắt sớm'
    ],
    equipment: [
      'Hệ thống Nội soi tiêu hóa ống mềm Olympus EVIS X1 phóng đại 135 lần có gây mê êm ái',
      'Máy xét nghiệm vi khuẩn HP qua hơi thở Urease hơi thở C13 không xâm lấn an toàn',
      'Dụng cụ can thiệp nội soi cắt polyp dạ dày đại tràng bằng thòng lọng Snare điện cao tần',
      'Máy đo pH thực quản 24 giờ chẩn đoán trào ngược kháng trị'
    ],
    doctors: 'TS.BS Lê Thành Đạt, BSCKII Quách Trọng Đức, BSCKII Đào Thị Yến',
    hospitals: 'BV Đại học Y Dược TP.HCM, BV Chợ Rẫy, Medic Hòa Hảo, PK Doctor Check'
  },
  noi_truyen_nhiem: {
    id: 'noi_truyen_nhiem',
    name: 'Nội Truyền Nhiễm',
    icon: '🦠',
    badge: 'Bệnh nhiệt đới cấp tính',
    symptoms: [
      'Sốt cao đột ngột liên tục 39 - 40 độ C, uống hạ sốt đáp ứng kém',
      'Đau nhức hai hốc mắt, đau cơ toàn thân, đau nhức khớp dữ dội',
      'Xuất hiện chấm xuất huyết dưới da, chảy máu chân răng hoặc nôn ra máu',
      'Ho nhiều, sốt rét run, đau họng, cơ thể kiệt sức rã rời',
      'Nổi mẩn ngứa da ngứa ngáy nhiều về đêm do nghi ngờ nhiễm ấu trùng giun sán'
    ],
    diseases: [
      'Sốt xuất huyết Dengue cảnh báo dấu hiệu chuyển nặng hạ tiểu cầu',
      'Viêm gan siêu vi A, B, C, E cấp tính và đợt bùng phát mạn tính',
      'Nhiễm cúm A (H1N1, H3N2), cúm B, sốt siêu vi và nhiễm virus kéo dài',
      'Bệnh ký sinh trùng: Giun đũa chó mèo (Toxocara), sán lá gan lớn, sán dải',
      'Bệnh thủy đậu (trái rạ), quai bị, sốt phát ban sởi và uốn ván'
    ],
    equipment: [
      'Hệ thống xét nghiệm Real-time PCR khuếch đại gen xác định nhanh virus Dengue, HBV, HCV',
      'Máy đo tải lượng virus định lượng bản sao DNA/RNA tự động Abbott m2000',
      'Kỹ thuật ELISA miễn dịch men tìm kháng thể kháng kháng nguyên giun sán ký sinh',
      'Máy đo độ đông máu tự động Stago kiểm soát xuất huyết nguy kịch'
    ],
    doctors: 'PGS.TS.BS Bùi Vũ Huy, BSCKII Trần Tịnh Hiền, TS.BS Huỳnh Thị Loan',
    hospitals: 'BV Bệnh Nhiệt Đới TP.HCM, BV Bệnh Nhiệt Đới Trung Ương, Viện Pasteur'
  },
  noi_ho_hap: {
    id: 'noi_ho_hap',
    name: 'Nội Hô Hấp',
    icon: '🫁',
    badge: 'Sức khỏe đường thở',
    symptoms: [
      'Ho kéo dài trên 3 tuần không dứt, ho khan từng cơn hoặc ho có đờm đặc',
      'Khó thở, thở rít, thở khò khè nghe tiếng rít như tiếng còi đặc biệt về đêm',
      'Đau tức ngực một hoặc hai bên khi hít thở sâu hoặc khi ho mạnh',
      'Ho ra máu tươi hoặc đờm vướng tia máu sẫm màu',
      'Hụt hơi khi leo cầu thang, mệt mỏi giảm khả năng vận động thể lực'
    ],
    diseases: [
      'Hen phế quản (Suyễn) người lớn và trẻ em',
      'Bệnh phổi tắc nghẽn mạn tính (COPD) ở người có tiền sử hút thuốc lá',
      'Viêm phế quản cấp và mạn tính, giãn phế quản bội nhiễm',
      'Viêm phổi thùy, viêm phổi kẽ và Tầm soát bệnh Lao phổi',
      'Hội chứng tổn thương xơ hóa nhu mô phổi sau nhiễm trùng đường thở'
    ],
    equipment: [
      'Máy đo chức năng thông khí phổi hô hấp ký Spirometry nồng độ FEV1/FVC',
      'Hệ thống chụp cắt lớp vi tính lồng ngực độ phân giải cao HRCT ngực liều thấp',
      'Hệ thống nội soi phế quản ống mềm Pentax lấy dịch rửa phế nang tìm vi khuẩn lao GeneXpert',
      'Máy đo nồng độ FeNO hơi thở đánh giá mức độ viêm đường thở dị ứng'
    ],
    doctors: 'PGS.TS.BS Trần Văn Ngọc, TS.BS Lê Khắc Bảo, BSCKII Nguyễn Hồng Đức',
    hospitals: 'BV Phạm Ngọc Thạch TP.HCM, BV Phổi Trung Ương, BV Chợ Rẫy, BV Bạch Mai'
  },
  noi_tiet_nieu: {
    id: 'noi_tiet_nieu',
    name: 'Nội Tiết Niệu',
    icon: '🫘',
    badge: 'Sức khỏe thận tiết niệu',
    symptoms: [
      'Đau quặn thận: Cơn đau đột ngột dữ dội từ hông lưng lan xuống bẹn cơ quan sinh dục',
      'Đi tiểu buốt rát, tiểu dắt, tiểu són nhiều lần nhưng mỗi lần ra ít giọt',
      'Nước tiểu đỏ hồng có máu, nước tiểu đục có mùi hôi hoặc cặn sỏi nhỏ',
      'Bí tiểu, dòng tiểu yếu, tiểu ngắt quãng phải rặn lâu (ở nam giới lớn tuổi)',
      'Phù mắt vào buổi sáng, phù hai mu bàn chân, huyết áp tăng cao khó kiểm soát'
    ],
    diseases: [
      'Sỏi thận, sỏi niệu quản, sỏi bàng quang kích thước lớn',
      'Nhiễm trùng đường tiết niệu (Viêm niệu đạo, viêm bàng quang cấp)',
      'Phì đại lành tính tuyến tiền liệt (BPH) và Viêm tuyến tiền liệt',
      'Hội chứng thận hư nguyên phát và Viêm cầu thận cấp/mạn tính',
      'Suy thận mạn tính các giai đoạn cần quản lý và bảo tồn chức năng thận'
    ],
    equipment: [
      'Hệ thống máy siêu âm thận tiết niệu Doppler màu khảo sát kích thước sỏi và ứ nước',
      'Máy chụp X-quang hệ tiết niệu không chuẩn bị KUB và chụp UIV có tiêm thuốc',
      'Hệ thống tán sỏi ngoài cơ thể bằng sóng xung kích ESWL không cần phẫu thuật',
      'Máy xét nghiệm sinh hóa tự động Cobas đo chỉ số Ure, Creatinin máu và độ lọc cầu thận eGFR'
    ],
    doctors: 'PGS.TS.BS Vũ Lê Chuyên, BSCKII Nguyễn Văn Ân, TS.BS Nguyễn Phúc Cẩm Hoàng',
    hospitals: 'BV Bình Dân TP.HCM, BV Việt Đức Hà Nội, BV Chợ Rẫy, BV Bạch Mai'
  },
  ngoai_co_xuong_khop: {
    id: 'ngoai_co_xuong_khop',
    name: 'Ngoại Cơ Xương Khớp',
    icon: '🦾',
    badge: 'Phẫu thuật chỉnh hình',
    symptoms: [
      'Khớp gối lỏng lẻo, cảm giác trẹo khớp hoặc mất vững sau khi chơi thể thao/tai nạn',
      'Đau buốt không thể tì đè sức nặng lên chân sau chấn thương té ngã',
      'Biến dạng lệch trục khớp gối, khớp háng hạn chế đi lại sinh hoạt',
      'Gãy xương kín/hở, trật khớp vai, trật khớp khuỷu cấp tính',
      'Hạn chế cử động khớp vai, không thể nhấc tay lên cao chải đầu (rách gân chóp xoay)'
    ],
    diseases: [
      'Đứt dây chằng chéo trước (ACL), dây chằng chéo sau (PCL) và rách sụn chêm khớp gối',
      'Thoái hóa khớp háng và khớp gối nặng giai đoạn cuối cần thay khớp nhân tạo',
      'Rách gân chóp xoay khớp vai và hội chứng chạm mỏm cùng vai',
      'Gãy xương chi trên, chi dưới và vỡ xương chậu phức tạp cần kết hợp xương nẹp vít',
      'Dị tật thừa ngón tay, bàn chân khoèo bẩm sinh ở trẻ em'
    ],
    equipment: [
      'Hệ thống phẫu thuật nội soi khớp Full-HD Stryker Mỹ với dao đốt lưỡng cực RF',
      'Máy chụp cộng hưởng từ MRI chuyên biệt chi khớp 1.5 Tesla',
      'Dàn máy C-arm chụp X-quang tăng sáng truyền hình trong phòng mổ vô trùng',
      'Vật liệu khớp gối khớp háng nhân tạo titan thế hệ mới độ bền sinh học trên 25 năm'
    ],
    doctors: 'TS.BS Trương Trí Tư, BSCKII Phan Vương Huy Đổng, TS.BS Tăng Hà Nam Anh',
    hospitals: 'BV Chấn Thương Chỉnh Hình TP.HCM, BV Việt Đức, BV Quân Y 175, BV Tâm Anh'
  },
  san_phu_khoa: {
    id: 'san_phu_khoa',
    name: 'Sản - Phụ Khoa',
    icon: '🌸',
    badge: 'Chăm sóc mẹ & bé',
    symptoms: [
      'Rối loạn chu kỳ kinh nguyệt: Chậm kinh, rong kinh rong huyết, thống kinh đau bụng dữ dội',
      'Khí hư ra nhiều bất thường, đổi màu vàng xanh, có bọt, mùi hôi tanh ngứa ngáy',
      'Đau tức âm ỉ hoặc quặn thắt vùng hạ vị (bụng dưới), đau buốt khi quan hệ',
      'Khám thai định kỳ theo dõi nhịp tim thai, cử động thai máy và phát hiện sớm bất thường',
      'Chậm có con sau 1 năm quan hệ tự nhiên không dùng biện pháp tránh thai'
    ],
    diseases: [
      'Viêm nhiễm đường sinh dục nữ do nấm Candida, trùng roi Trichomonas, vi khuẩn',
      'U xơ tử cung, u nang buồng trứng, lạc nội mạc tử cung vùng chậu',
      'Hội chứng buồng trứng đa nang (PCOS) gây khó rụng trứng',
      'Theo dõi thai kỳ nguy cơ cao (Tiền sản giật, đái tháo đường thai kỳ, dọa sinh non)',
      'Tầm soát tổn thương tiền ung thư cổ tử cung bằng phương pháp ThinPrep Pap và HPV Cobas'
    ],
    equipment: [
      'Máy siêu âm thai màu 4D/5D Voluson E10 chuyên dụng sản phụ khoa GE Healthcare',
      'Hệ thống máy soi cổ tử cung kỹ thuật số Carl Zeiss phóng đại 40 lần phát hiện loạn sản',
      'Máy đo tim thai và cơn gò tử cung Monitoring sản khoa thế hệ mới',
      'Hệ thống xét nghiệm sàng lọc trước sinh không xâm lấn NIPT Illumina thế hệ mới'
    ],
    doctors: 'BSCKII Nguyễn Thị Ngọc Lan, BSCKII Trần Thị Mai, PGS.TS Vũ Bích Hiển',
    hospitals: 'BV Từ Dũ, BV Hùng Vương, BV Phụ Sản Hà Nội, BV Phụ Sản Trung Ương, BV Hạnh Phúc'
  },
  ngoai_tieu_hoa: {
    id: 'ngoai_tieu_hoa',
    name: 'Ngoại Tiêu Hoá',
    icon: '🩺',
    badge: 'Phẫu thuật xâm lấn tối thiểu',
    symptoms: [
      'Đau bụng cấp tính vùng hố chậu phải kèm sốt nhẹ, buồn nôn (cảnh báo ruột thừa)',
      'Búi trĩ sa ra ngoài hậu môn khi đi cầu, đi cầu ra máu tươi nhỏ giọt hoặc thành tia',
      'Cơn đau quặn gan dữ dội từng cơn lan lên vai phải kèm sốt vàng da tắc mật',
      'Đau rát dữ dội hậu môn khi đi vệ sinh, rỉ dịch hôi (nứt kẽ hậu môn, rò hậu môn)',
      'Xuất hiện khối phồng vùng bẹn khi ho rặn hoặc đứng lâu (thoát vị bẹn)'
    ],
    diseases: [
      'Viêm ruột thừa cấp tính cần phẫu thuật nội soi khẩn cấp',
      'Bệnh trĩ nội, trĩ ngoại độ 2, 3, 4 và trĩ vòng huyết khối nghẹt',
      'Sỏi túi mật có triệu chứng, polyp túi mật kích thước trên 10mm cần cắt túi mật',
      'Thoát vị bẹn, thoát vị rốn, thoát vị vết mổ thành bụng',
      'Nứt kẽ hậu môn mạn tính, rò hậu môn (áp xe hậu môn trực tràng)'
    ],
    equipment: [
      'Hệ thống phẫu thuật nội soi ổ bụng 4K Karl Storz của Đức với dao siêu âm Harmonic',
      'Súng cắt khâu trĩ tự động Longo thế hệ mới hạn chế đau sau mổ xuất viện trong ngày',
      'Máy laser Diode bước sóng 1470nm can thiệp tiêu trĩ không vết mổ hở',
      'Hệ thống máy tán sỏi đường mật thủy điện lực hoặc laser trong mổ'
    ],
    doctors: 'PGS.TS.BS Nguyễn Tấn Cường, BSCKII Lê Huy Lưu, TS.BS Đỗ Minh Hùng',
    hospitals: 'BV Bình Dân TP.HCM, BV Đại học Y Dược TP.HCM, BV Việt Đức Hà Nội, BV Chợ Rẫy'
  }
};

// ── 2. DANH SÁCH 40 CƠ SỞ Y TẾ TOÀN QUỐC (10 CƠ SỞ MỖI MỤC) ──
const NATIONWIDE_FACILITIES = [
  // ── 10 BỆNH VIỆN CÔNG LẬP ──
  {
    id: 'bv_cong_01',
    name: 'Bệnh viện Chợ Rẫy',
    type: 'cong',
    typeLabel: 'Bệnh viện Công lập',
    city: 'hcm',
    cityLabel: 'TP. Hồ Chí Minh',
    address: '201B Nguyễn Chí Thanh, Phường 12, Quận 5, TP.HCM',
    specialties: 'Đa khoa tuyến cuối, Tim mạch, Ung bướu, Ngoại khoa',
    rating: '4.9',
    reviews: '12.450',
    hours: 'Thứ 2 - Thứ 6 (06:00 - 16:00)',
    img: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'bv_cong_02',
    name: 'Bệnh viện Bạch Mai',
    type: 'cong',
    typeLabel: 'Bệnh viện Công lập',
    city: 'hn',
    cityLabel: 'Hà Nội',
    address: '78 Đường Giải Phóng, Phương Mai, Đống Đa, Hà Nội',
    specialties: 'Nội khoa tổng hợp, Tim mạch, Tiêu hóa, Hồi sức cấp cứu',
    rating: '4.9',
    reviews: '15.820',
    hours: 'Thứ 2 - Thứ 7 (06:30 - 17:00)',
    img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'bv_cong_03',
    name: 'Bệnh viện Đại học Y Dược TP.HCM',
    type: 'cong',
    typeLabel: 'Bệnh viện Công lập',
    city: 'hcm',
    cityLabel: 'TP. Hồ Chí Minh',
    address: '215 Hồng Bàng, Phường 11, Quận 5, TP.HCM',
    specialties: 'Tiêu hóa gan mật, Tim mạch, Thần kinh, Cơ xương khớp',
    rating: '4.9',
    reviews: '18.300',
    hours: 'Thứ 2 - Thứ 7 (05:00 - 16:30)',
    img: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'bv_cong_04',
    name: 'Bệnh viện Trung ương Huế',
    type: 'cong',
    typeLabel: 'Bệnh viện Công lập',
    city: 'mientrung',
    cityLabel: 'Thừa Thiên Huế / Đà Nẵng',
    address: '16 Lê Lợi, Vĩnh Ninh, TP. Huế',
    specialties: 'Ghép tạng, Tim mạch can thiệp, Ung bướu, Nhi khoa',
    rating: '4.8',
    reviews: '8.900',
    hours: 'Thứ 2 - Thứ 6 (06:30 - 16:30)',
    img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'bv_cong_05',
    name: 'Bệnh viện Đa khoa Đà Nẵng',
    type: 'cong',
    typeLabel: 'Bệnh viện Công lập',
    city: 'dn',
    cityLabel: 'Đà Nẵng',
    address: '124 Hải Phòng, Thạch Thang, Hải Châu, Đà Nẵng',
    specialties: 'Cấp cứu, Ngoại thần kinh, Đột quỵ, Tim mạch',
    rating: '4.8',
    reviews: '6.400',
    hours: 'Thứ 2 - Thứ 7 (07:00 - 17:00)',
    img: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'bv_cong_06',
    name: 'Bệnh viện Từ Dũ',
    type: 'cong',
    typeLabel: 'Bệnh viện Công lập',
    city: 'hcm',
    cityLabel: 'TP. Hồ Chí Minh',
    address: '284 Cống Quỳnh, Phạm Ngũ Lão, Quận 1, TP.HCM',
    specialties: 'Sản phụ khoa, Hiếm muộn IVF, Khám thai định kỳ',
    rating: '4.9',
    reviews: '21.000',
    hours: 'Thứ 2 - Chủ Nhật (24/7)',
    img: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'bv_cong_07',
    name: 'Bệnh viện Trung ương Quân đội 108',
    type: 'cong',
    typeLabel: 'Bệnh viện Công lập',
    city: 'hn',
    cityLabel: 'Hà Nội',
    address: 'Số 1 Trần Hưng Đạo, Bạch Đằng, Hai Bà Trưng, Hà Nội',
    specialties: 'Đa khoa chuyên sâu, Phẫu thuật Robot, Tim mạch',
    rating: '4.9',
    reviews: '11.500',
    hours: 'Thứ 2 - Thứ 7 (06:30 - 17:00)',
    img: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'bv_cong_08',
    name: 'Bệnh viện Quân Y 175',
    type: 'cong',
    typeLabel: 'Bệnh viện Công lập',
    city: 'hcm',
    cityLabel: 'TP. Hồ Chí Minh',
    address: '786 Nguyễn Kiệm, Phường 3, Gò Vấp, TP.HCM',
    specialties: 'Chấn thương chỉnh hình, Cấp cứu trực thăng, Tim mạch',
    rating: '4.8',
    reviews: '7.800',
    hours: 'Thứ 2 - Thứ 6 (07:00 - 16:30)',
    img: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'bv_cong_09',
    name: 'Bệnh viện Đa khoa Trung ương Cần Thơ',
    type: 'cong',
    typeLabel: 'Bệnh viện Công lập',
    city: 'cantho',
    cityLabel: 'Cần Thơ / Miền Tây',
    address: '315 Nguyễn Văn Linh, An Khánh, Ninh Kiều, Cần Thơ',
    specialties: 'Tuyến cuối Đồng bằng Sông Cửu Long, Tim mạch, Đột quỵ',
    rating: '4.7',
    reviews: '5.600',
    hours: 'Thứ 2 - Thứ 6 (06:30 - 16:30)',
    img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'bv_cong_10',
    name: 'Bệnh viện Đa khoa Tỉnh Đồng Nai',
    type: 'cong',
    typeLabel: 'Bệnh viện Công lập',
    city: 'dongnai',
    cityLabel: 'Đồng Nai',
    address: 'Số 2 Đồng Khởi, Phường Tam Hòa, TP. Biên Hòa, Đồng Nai',
    specialties: 'Đa khoa toàn diện, Cấp cứu, Tim mạch can thiệp, Sản khoa',
    rating: '4.8',
    reviews: '8.400',
    hours: 'Thứ 2 - Thứ 7 (06:30 - 16:30)',
    img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80'
  },

  // ── 10 BỆNH VIỆN TƯ NHÂN ──
  {
    id: 'bv_tu_01',
    name: 'Bệnh viện Đa khoa Tâm Anh',
    type: 'tu',
    typeLabel: 'Bệnh viện Tư nhân',
    city: 'hcm',
    cityLabel: 'TP.HCM & Hà Nội',
    address: '2B Phổ Quang, Phường 2, Tân Bình, TP.HCM & Long Biên, Hà Nội',
    specialties: 'Hỗ trợ sinh sản IVF, Tim mạch, Cơ xương khớp kỹ thuật cao',
    rating: '5.0',
    reviews: '9.200',
    hours: 'Thứ 2 - Chủ Nhật (07:00 - 19:30)',
    img: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'bv_tu_02',
    name: 'Bệnh viện Đa khoa Quốc tế Vinmec',
    type: 'tu',
    typeLabel: 'Bệnh viện Tư nhân',
    city: 'hcm',
    cityLabel: 'Toàn quốc (Hà Nội, TP.HCM, Đà Nẵng)',
    address: '208 Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh, TP.HCM',
    specialties: 'Tiêu chuẩn quốc tế JCI, Ung bướu xạ trị, Tim mạch, Sản khoa',
    rating: '5.0',
    reviews: '14.100',
    hours: 'Thứ 2 - Thứ 7 (07:30 - 17:00)',
    img: 'https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'bv_tu_03',
    name: 'Bệnh viện Đa khoa Triều An',
    type: 'tu',
    typeLabel: 'Bệnh viện Tư nhân',
    city: 'hcm',
    cityLabel: 'TP. Hồ Chí Minh',
    address: '425 Kinh Dương Vương, An Lạc, Bình Tân, TP.HCM',
    specialties: 'Khám đa khoa chất lượng cao, Tim mạch, Sản khoa, Thận nhân tạo',
    rating: '4.9',
    reviews: '7.300',
    hours: 'Thứ 2 - Thứ 7 (06:30 - 18:00)',
    img: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'bv_tu_04',
    name: 'Bệnh viện Đa khoa Phương Đông',
    type: 'tu',
    typeLabel: 'Bệnh viện Tư nhân',
    city: 'hn',
    cityLabel: 'Hà Nội',
    address: 'Số 9 Phố Viên, Cổ Nhuế 2, Bắc Từ Liêm, Hà Nội',
    specialties: 'Bệnh viện khách sạn 5 sao, Thai sản trọn gói, Cơ xương khớp',
    rating: '5.0',
    reviews: '8.650',
    hours: 'Thứ 2 - Chủ Nhật (07:00 - 19:00)',
    img: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'bv_tu_05',
    name: 'Bệnh viện Quốc tế Hạnh Phúc',
    type: 'tu',
    typeLabel: 'Bệnh viện Tư nhân',
    city: 'bd',
    cityLabel: 'Bình Dương & TP.HCM',
    address: '18 Đại lộ Bình Dương, Vĩnh Phú, Thuận An, Bình Dương',
    specialties: 'Sản phụ khoa tiêu chuẩn Singapore, Nhi sơ sinh, Hiếm muộn',
    rating: '4.9',
    reviews: '6.700',
    hours: 'Thứ 2 - Thứ 7 (07:30 - 16:30)',
    img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'bv_tu_06',
    name: 'Bệnh viện Đa khoa Quốc tế Thu Cúc',
    type: 'tu',
    typeLabel: 'Bệnh viện Tư nhân',
    city: 'hn',
    cityLabel: 'Hà Nội',
    address: '286 Thụy Khuê, Tây Hồ, Hà Nội',
    specialties: 'Khám sức khỏe tổng quát, Tầm soát ung thư, Sản trọn gói',
    rating: '4.9',
    reviews: '12.800',
    hours: 'Thứ 2 - Chủ Nhật (07:00 - 17:00)',
    img: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'bv_tu_07',
    name: 'Bệnh viện Hoàn Mỹ Sài Gòn',
    type: 'tu',
    typeLabel: 'Bệnh viện Tư nhân',
    city: 'hcm',
    cityLabel: 'TP. Hồ Chí Minh',
    address: '60-60A Phan Xích Long, Phường 1, Phú Nhuận, TP.HCM',
    specialties: 'Tim mạch, Tiêu hóa, Ngoại tiết niệu, Khám sức khỏe VIP',
    rating: '4.8',
    reviews: '11.000',
    hours: 'Thứ 2 - Thứ 7 (06:00 - 16:00)',
    img: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'bv_tu_08',
    name: 'Bệnh viện Pháp Việt (FV Hospital)',
    type: 'tu',
    typeLabel: 'Bệnh viện Tư nhân',
    city: 'hcm',
    cityLabel: 'TP. Hồ Chí Minh',
    address: '6 Nguyễn Lương Bằng, Tân Phú, Quận 7, TP.HCM',
    specialties: 'Tiêu chuẩn Pháp JCI, Đa chuyên khoa, Bác sĩ nước ngoài',
    rating: '4.9',
    reviews: '8.200',
    hours: 'Thứ 2 - Thứ 7 (07:30 - 17:00)',
    img: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'bv_tu_09',
    name: 'Bệnh viện Quốc tế Nam Sài Gòn',
    type: 'tu',
    typeLabel: 'Bệnh viện Tư nhân',
    city: 'hcm',
    cityLabel: 'TP. Hồ Chí Minh',
    address: 'Số 88, Đường số 8, KDC Trung Sơn, Bình Chánh, TP.HCM',
    specialties: 'Ngoại thần kinh, Cột sống, Chấn thương chỉnh hình',
    rating: '4.8',
    reviews: '5.100',
    hours: 'Thứ 2 - Thứ 7 (07:00 - 17:00)',
    img: 'https://images.unsplash.com/photo-1584467735867-4297ae2ebcee?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'bv_tu_10',
    name: 'Bệnh viện Quốc tế Hoàn Mỹ Đồng Nai',
    type: 'tu',
    typeLabel: 'Bệnh viện Tư nhân',
    city: 'dongnai',
    cityLabel: 'Đồng Nai',
    address: '1048 Đồng Khởi, Khu phố 2, Phường Tân Mai, TP. Biên Hòa',
    specialties: 'Đa khoa quốc tế, Sản nhi, Cấp cứu 24/7, Tán sỏi laser',
    rating: '4.8',
    reviews: '6.300',
    hours: 'Thứ 2 - Thứ 7 (07:00 - 16:30)',
    img: 'https://images.unsplash.com/photo-1502740479091-635887520276?auto=format&fit=crop&w=600&q=80'
  },

  // ── 10 PHÒNG KHÁM ĐA KHOA & CHUYÊN KHOA ──
  {
    id: 'pk_01',
    name: 'Phòng Khám Da Liễu BS.CKII Đoàn Văn Lợi Em',
    type: 'phongkham',
    typeLabel: 'Phòng Khám Chuyên Khoa',
    city: 'hcm',
    cityLabel: 'TP. Hồ Chí Minh',
    address: 'Quận Tân Phú, TP. Hồ Chí Minh',
    specialties: 'Trị mụn y khoa, Viêm da cơ địa, Nám, Tàn nhang, Sẹo rỗ',
    rating: '5.0',
    reviews: '3.400',
    hours: 'Thứ 2 - Chủ Nhật (16:30 - 20:30)',
    img: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pk_02',
    name: 'Phòng khám Đa khoa Quốc tế Hàng Xanh',
    type: 'phongkham',
    typeLabel: 'Phòng Khám Đa Khoa',
    city: 'hcm',
    cityLabel: 'TP. Hồ Chí Minh',
    address: '395 Điện Biên Phủ, Phường 25, Bình Thạnh, TP.HCM',
    specialties: 'Khám sức khỏe xin việc, Lái xe, Nội soi tiêu hóa, Tai mũi họng',
    rating: '4.8',
    reviews: '4.900',
    hours: 'Thứ 2 - Thứ 7 (07:00 - 19:30)',
    img: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pk_03',
    name: 'Bệnh viện Mắt Quốc Tế Á Châu',
    type: 'phongkham',
    typeLabel: 'Phòng Khám Chuyên Khoa',
    city: 'hcm',
    cityLabel: 'TP. Hồ Chí Minh',
    address: '228 Bà Hạt, Phường 9, Quận 10, TP.HCM',
    specialties: 'Đo khúc xạ mắt, Mổ cận thị Lasik/Relex Smile, Cườm mắt',
    rating: '4.9',
    reviews: '4.200',
    hours: 'Thứ 2 - Thứ 7 (07:30 - 17:00)',
    img: 'https://images.unsplash.com/photo-1574755393849-623942496936?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pk_04',
    name: 'Phòng khám Cơ Xương Khớp Việt Đức',
    type: 'phongkham',
    typeLabel: 'Phòng Khám Chuyên Khoa',
    city: 'hn',
    cityLabel: 'Hà Nội',
    address: 'Số 16 Phủ Doãn, Hàng Bông, Hoàn Kiếm, Hà Nội',
    specialties: 'Chuyên gia Việt Đức, Tiêm khớp PRP, Thoát vị đĩa đệm',
    rating: '4.9',
    reviews: '3.800',
    hours: 'Thứ 2 - Thứ 7 (07:30 - 17:30)',
    img: 'https://images.unsplash.com/photo-1574755393849-623942496936?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pk_05',
    name: 'Phòng khám Tiêu Hóa Gan Mật Doctor Check',
    type: 'phongkham',
    typeLabel: 'Phòng Khám Chuyên Khoa',
    city: 'hcm',
    cityLabel: 'TP. Hồ Chí Minh',
    address: '429 Tô Hiến Thành, Phường 14, Quận 10, TP.HCM',
    specialties: 'Nội soi dạ dày đại tràng êm ái, Tầm soát ung thư tiêu hóa',
    rating: '5.0',
    reviews: '2.950',
    hours: 'Thứ 2 - Thứ 7 (06:00 - 15:00)',
    img: 'https://images.unsplash.com/photo-1578496781985-452d4a934d50?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pk_06',
    name: 'Trung tâm Y khoa Pasteur Đà Nẵng',
    type: 'phongkham',
    typeLabel: 'Phòng Khám Đa Khoa',
    city: 'dn',
    cityLabel: 'Đà Nẵng',
    address: '19 Nguyễn Tường Phổ, Hòa Minh, Liên Chiểu, Đà Nẵng',
    specialties: 'Đa khoa toàn diện, Chẩn đoán hình ảnh, Nhi khoa, Xét nghiệm',
    rating: '4.8',
    reviews: '3.100',
    hours: 'Thứ 2 - Chủ Nhật (07:00 - 19:00)',
    img: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pk_07',
    name: 'Phòng khám Đa khoa Medlatec',
    type: 'phongkham',
    typeLabel: 'Phòng Khám Đa Khoa',
    city: 'hn',
    cityLabel: 'Toàn quốc (Hà Nội, Hải Phòng, Cần Thơ)',
    address: '99 Trích Sài, Tây Hồ, Hà Nội',
    specialties: 'Khám sức khỏe tổng quát, Khám doanh nghiệp, Lấy mẫu tận nơi',
    rating: '4.8',
    reviews: '6.500',
    hours: 'Thứ 2 - Chủ Nhật (07:00 - 20:00)',
    img: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pk_08',
    name: 'Phòng khám Nhi Đồng Care Sài Gòn',
    type: 'phongkham',
    typeLabel: 'Phòng Khám Chuyên Khoa',
    city: 'hcm',
    cityLabel: 'TP. Hồ Chí Minh',
    address: '124 Lê Văn Sỹ, Phường 10, Phú Nhuận, TP.HCM',
    specialties: 'Bác sĩ BV Nhi Đồng, Khám hô hấp, Dinh dưỡng, Tiêm vắc xin',
    rating: '4.9',
    reviews: '3.700',
    hours: 'Thứ 2 - Chủ Nhật (07:30 - 20:30)',
    img: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pk_09',
    name: 'Phòng khám Đa khoa An Khang Đồng Nai',
    type: 'phongkham',
    typeLabel: 'Phòng Khám Đa Khoa',
    city: 'dongnai',
    cityLabel: 'Đồng Nai',
    address: 'Số 42 CMT8, Phường Quyết Thắng, TP. Biên Hòa, Đồng Nai',
    specialties: 'Khám sức khỏe lao động, Khám bảo hiểm y tế, Siêu âm màu 4D',
    rating: '4.7',
    reviews: '2.800',
    hours: 'Thứ 2 - Thứ 7 (07:00 - 17:00)',
    img: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pk_10',
    name: 'Phòng khám Tim Mạch & Nội Tiết Thăng Long',
    type: 'phongkham',
    typeLabel: 'Phòng Khám Chuyên Khoa',
    city: 'hn',
    cityLabel: 'Hà Nội',
    address: 'Số 122 Trần Đại Nghĩa, Đồng Tâm, Hai Bà Trưng, Hà Nội',
    specialties: 'Chuyên gia tim mạch Viện Tim Quốc gia, Đái tháo đường, Mỡ máu',
    rating: '4.9',
    reviews: '3.200',
    hours: 'Thứ 2 - Thứ 7 (07:30 - 17:30)',
    img: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80'
  },

  // ── 10 TRUNG TÂM XÉT NGHIỆM & CHẨN ĐOÁN HÌNH ẢNH ──
  {
    id: 'xn_01',
    name: 'Trung tâm Xét nghiệm Y khoa Laditec',
    type: 'xetnghiem',
    typeLabel: 'Trung Tâm Xét Nghiệm',
    city: 'bd',
    cityLabel: 'Bình Dương & TP.HCM',
    address: 'TP. Thủ Dầu Một, Tỉnh Bình Dương',
    specialties: 'Xét nghiệm máu tại nhà, Chức năng gan thận, Tầm soát ung thư',
    rating: '4.9',
    reviews: '4.800',
    hours: 'Thứ 2 - Chủ Nhật (06:00 - 19:00)',
    img: 'https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'xn_02',
    name: 'Trung tâm Chẩn đoán Y khoa Medic Hòa Hảo',
    type: 'xetnghiem',
    typeLabel: 'Trung Tâm Chẩn Đoán',
    city: 'hcm',
    cityLabel: 'TP. Hồ Chí Minh',
    address: '254 Hòa Hảo, Phường 4, Quận 10, TP.HCM',
    specialties: 'Chụp cộng hưởng từ MRI, CT 128 lát, Xét nghiệm sinh hóa miễn dịch',
    rating: '4.8',
    reviews: '24.000',
    hours: 'Thứ 2 - Thứ 7 (04:00 - 19:00)',
    img: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'xn_03',
    name: 'Hệ thống Xét nghiệm Diag Laboratories',
    type: 'xetnghiem',
    typeLabel: 'Trung Tâm Xét Nghiệm',
    city: 'hcm',
    cityLabel: 'Toàn quốc (30+ chi nhánh)',
    address: '414-420 Cao Thắng, Phường 12, Quận 10, TP.HCM',
    specialties: 'Tiêu chuẩn châu Âu ISO 15189, Lấy mẫu tại nhà, Trả kết quả online',
    rating: '4.9',
    reviews: '16.500',
    hours: 'Thứ 2 - Chủ Nhật (06:00 - 18:00)',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'xn_04',
    name: 'Trung tâm Xét nghiệm Y khoa Medlatec Toàn Quốc',
    type: 'xetnghiem',
    typeLabel: 'Trung Tâm Xét Nghiệm',
    city: 'hn',
    cityLabel: 'Hà Nội & 63 Tỉnh Thành',
    address: '42-44 Nghĩa Dũng, Phúc Xá, Ba Đình, Hà Nội',
    specialties: 'Thương hiệu lấy mẫu tận nơi số 1 Việt Nam, Đủ mọi xét nghiệm',
    rating: '4.9',
    reviews: '32.000',
    hours: 'Thứ 2 - Chủ Nhật (24/7)',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'xn_05',
    name: 'Viện Pasteur TP. Hồ Chí Minh',
    type: 'xetnghiem',
    typeLabel: 'Viện Nghiên Cứu & Xét Nghiệm',
    city: 'hcm',
    cityLabel: 'TP. Hồ Chí Minh',
    address: '167 Pasteur, Phường 8, Quận 3, TP.HCM',
    specialties: 'Xét nghiệm kháng thể, Tiêm chủng quốc tế, Bệnh truyền nhiễm',
    rating: '4.9',
    reviews: '19.400',
    hours: 'Thứ 2 - Thứ 7 (07:00 - 16:30)',
    img: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'xn_06',
    name: 'Trung tâm Tầm soát Ung thư Bernard Clinic',
    type: 'xetnghiem',
    typeLabel: 'Trung Tâm Chẩn Đoán',
    city: 'hcm',
    cityLabel: 'TP. Hồ Chí Minh',
    address: '201 Nam Kỳ Khởi Nghĩa, Phường 7, Quận 3, TP.HCM',
    specialties: 'Mô hình tầm soát Nhật Bản Ningen Dock, MRI toàn thân, CT ngực liều thấp',
    rating: '5.0',
    reviews: '2.100',
    hours: 'Thứ 2 - Thứ 7 (07:30 - 17:00)',
    img: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'xn_07',
    name: 'Trung tâm Xét nghiệm Di truyền Gentis',
    type: 'xetnghiem',
    typeLabel: 'Trung Tâm Di Truyền Học',
    city: 'hn',
    cityLabel: 'Hà Nội & TP.HCM',
    address: 'Tầng 2, Tòa nhà HCMCC, 249A Thụy Khuê, Tây Hồ, Hà Nội',
    specialties: 'Sàng lọc dị tật thai nhi NIPT, Giải mã gen ung thư di truyền, ADN',
    rating: '4.9',
    reviews: '5.400',
    hours: 'Thứ 2 - Chủ Nhật (08:00 - 18:00)',
    img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'xn_08',
    name: 'Hệ thống Tiêm chủng Quốc gia VNVC',
    type: 'xetnghiem',
    typeLabel: 'Trung Tâm Tiêm Chủng',
    city: 'hcm',
    cityLabel: 'Toàn quốc (150+ Trung tâm)',
    address: '198 Hoàng Văn Thụ, Phường 9, Phú Nhuận, TP.HCM',
    specialties: 'Hệ thống kho lạnh vắc xin đạt chuẩn GSP, Đầy đủ vắc xin trẻ em và người lớn',
    rating: '4.9',
    reviews: '45.000',
    hours: 'Thứ 2 - Chủ Nhật (07:30 - 17:00)',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'xn_09',
    name: 'Trung tâm Chẩn đoán Kỹ thuật cao Việt - Nhật',
    type: 'xetnghiem',
    typeLabel: 'Trung Tâm Chẩn Đoán',
    city: 'dn',
    cityLabel: 'Đà Nẵng',
    address: '320 Cách Mạng Tháng 8, Hòa Cường Nam, Hải Châu, Đà Nẵng',
    specialties: 'Chụp CT mạch vành, Siêu âm đàn hồi mô tuyến giáp, Đo loãng xương',
    rating: '4.8',
    reviews: '2.700',
    hours: 'Thứ 2 - Thứ 7 (07:00 - 17:30)',
    img: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'xn_10',
    name: 'Trung tâm Xét nghiệm Y khoa Labconn Đồng Nai',
    type: 'xetnghiem',
    typeLabel: 'Trung Tâm Xét Nghiệm',
    city: 'dongnai',
    cityLabel: 'Đồng Nai',
    address: 'Số 18 Võ Thị Sáu, Phường Quyết Thắng, TP. Biên Hòa, Đồng Nai',
    specialties: 'Lấy mẫu tận nhà Biên Hòa - Long Thành, Tầm soát tiểu đường, Mỡ máu',
    rating: '4.8',
    reviews: '2.300',
    hours: 'Thứ 2 - Chủ Nhật (06:00 - 17:30)',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80'
  }
];

if (typeof window !== 'undefined') {
  window.SPECIALTIES_KNOWLEDGE = SPECIALTIES_KNOWLEDGE;
  window.NATIONWIDE_FACILITIES = NATIONWIDE_FACILITIES;
}
