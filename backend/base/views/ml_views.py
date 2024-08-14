import nltk
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from textblob import TextBlob
from base.models import Review

@api_view(["GET"])
#@permission_classes([IsAdminUser])
def analyzeSentiment(request, product_id):
    reviews = Review.objects.filter(product_id=product_id)
    sentiments = []
    for review in reviews:
        analysis = TextBlob(review.comment)  # Corrected the attribute from review.content to review.comment
        sentiments.append({'review': review.comment, 'sentiment': analysis.sentiment.polarity})
    return Response(sentiments)