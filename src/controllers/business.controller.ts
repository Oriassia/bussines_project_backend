import { Request, Response } from "express";
import Business, { IBusiness } from "../models/business.model";
import Review, { IReview } from "../models/review.model";

// export interface IQuery {
//   name: string;
//   category: string;
//   rating: number;
// }
interface ICriteria {
  name?: { $regex: string; $options: string };
  category?: { $in: string[] };
  rating?: { $gte: number };
}

// todo : figure out type of query
function buildCritiria(query: any) {
  const critiria: ICriteria = {};

  if (query.name) {
    critiria.name = { $regex: query.name, $options: "i" };
  }

  if (query.category) {
    const categories = query.category
      .split(",")
      .map((category: String) => category.trim());

    critiria.category = { $in: categories };
  }
  if (query.rating) {
    critiria.rating = { $gte: query.rating };
  }

  return critiria;
}

export async function getBusinesses(
  req: Request,
  res: Response
): Promise<void> {
  const { query } = req;
  const critiria = buildCritiria(query);
  let page = (query.page && +query.page) || 1;
  if (page < 1) page = 1;

  const limit = (query.limit && +query.limit) || 8;
  const startIndex = (page - 1) * +limit || 0;
  try {
    const businesses: IBusiness[] = await Business.find(critiria)
      .skip(startIndex)
      .limit(limit)
      .exec();
    res.status(200).json(businesses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getBusinessAndReviewsById(
  req: Request,
  res: Response
): Promise<void> {
  const { businessId } = req.params;
  try {
    const business: IBusiness | null = await Business.findById(businessId)
      .lean()
      .exec();

    const reviewList: IReview[] | null = await Review.find({
      business: businessId,
    })
      .populate("user", "username")
      .lean()
      .exec();

    const businessWithReview = { ...business, reviews: reviewList };
    res.status(200).json(businessWithReview);
  } catch (error: any) {
    if (error.name === "CastError") {
      res
        .status(404)
        .json({ message: `Business not found with id: ${businessId}` });
      return;
    }
    res.status(500).json({ message: error.message });
  }
}
