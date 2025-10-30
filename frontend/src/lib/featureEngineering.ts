// Feature Engineering Helper
// Chuyển đổi input cơ bản thành 11 features cho model

export interface BasicCourseInput {
  price: number;           // VND
  rating: number;          // 0-5
  num_students: number;
  num_reviews: number;
  duration: number;        // minutes
  discount: number;        // 0-100 (percentage)
  lectures: number;
  sections: number;
}

export interface EngineeeredFeatures {
  rating: number;
  discount: number;                    // 0-1 (converted from percentage)
  log_num_reviews: number;
  log_num_students: number;
  log_price: number;
  log_total_length_minutes: number;
  sqrt_sections: number;
  effective_price: number;
  popularity_score: number;
  price_per_hour: number;
  discount_category: number;
}

/**
 * Chuyển đổi input cơ bản thành 11 features đã được feature engineering
 */
export function engineerFeatures(input: BasicCourseInput): EngineeeredFeatures {
  const {
    price,
    rating,
    num_students,
    num_reviews,
    duration,
    discount,
    lectures,
    sections
  } = input;

  // Đảm bảo không có giá trị âm
  const safeNumReviews = Math.max(1, num_reviews);
  const safeNumStudents = Math.max(1, num_students);
  const safePrice = Math.max(1, price);
  const safeDuration = Math.max(1, duration);

  // Convert discount từ percentage (0-100) sang decimal (0-1)
  const discountDecimal = discount / 100;

  // Log transformations (sử dụng natural log)
  const log_num_reviews = Math.log(safeNumReviews);
  const log_num_students = Math.log(safeNumStudents);
  const log_price = Math.log(safePrice);
  const log_total_length_minutes = Math.log(safeDuration);

  // Square root transformations
  const sqrt_sections = Math.sqrt(Math.max(1, sections));

  // Derived features
  const effective_price = price * (1 - discountDecimal); // Giá sau giảm
  const popularity_score = rating * num_students / 2; // Điểm phổ biến
  const price_per_hour = price / (duration / 60); // Giá mỗi giờ

  // Discount category (categorical)
  // 0: No discount, 1: Low (1-30%), 2: Medium (31-60%), 3: High (61-100%)
  let discount_category = 0;
  if (discount > 0 && discount <= 30) discount_category = 0;
  else if (discount > 30 && discount <= 60) discount_category = 1;
  else if (discount > 60) discount_category = 2;

  return {
    rating,
    discount: discountDecimal,
    log_num_reviews,
    log_num_students,
    log_price,
    log_total_length_minutes,
    sqrt_sections,
    effective_price,
    popularity_score,
    price_per_hour,
    discount_category
  };
}

/**
 * Validate input data
 */
export function validateCourseInput(input: BasicCourseInput): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (input.price < 0) errors.push('Giá phải lớn hơn hoặc bằng 0');
  if (input.rating < 0 || input.rating > 5) errors.push('Rating phải từ 0 đến 5');
  if (input.num_students < 0) errors.push('Số học viên phải >= 0');
  if (input.num_reviews < 0) errors.push('Số đánh giá phải >= 0');
  if (input.duration < 1) errors.push('Thời lượng phải >= 1 phút');
  if (input.discount < 0 || input.discount > 100) errors.push('Giảm giá phải từ 0-100%');
  if (input.lectures < 0) errors.push('Số bài giảng phải >= 0');
  if (input.sections < 0) errors.push('Số sections phải >= 0');

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Tạo data mẫu để test
 */
export function getSampleData(): BasicCourseInput {
  return {
    price: 369000,
    rating: 4.5,
    num_students: 1159767,
    num_reviews: 200000,
    duration: 2564,
    discount: 81,
    lectures: 386,
    sections: 46
  };
}

